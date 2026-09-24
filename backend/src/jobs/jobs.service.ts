import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { eq } from 'drizzle-orm';
import type { Env } from '../config/env.js';
import { DB, type Database } from '../database/database.module.js';
import { jobRuns } from '../database/schema.js';

export interface JobDefinition {
  name: string;
  // Cron expression evaluated in US Eastern time, where release schedules are published.
  cron?: string;
  run: () => Promise<void>;
}

export type JobTrigger = 'cron' | 'http';

const JOB_TIME_ZONE = 'America/New_York';

/**
 * Single place where background jobs are registered. Every job can run two ways:
 * in-process on its cron schedule (Render paid plan), or via POST /api/jobs/:name/run
 * (GitHub Actions fallback, or manual runs). Feature modules register jobs in onModuleInit.
 */
@Injectable()
export class JobsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(JobsService.name);
  private readonly jobs = new Map<string, JobDefinition>();
  private readonly running = new Set<string>();

  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly config: ConfigService<Env, true>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  register(job: JobDefinition) {
    if (this.jobs.has(job.name)) {
      throw new Error(`Job "${job.name}" is already registered`);
    }
    this.jobs.set(job.name, job);
  }

  list() {
    return [...this.jobs.values()].map(({ name, cron }) => ({
      name,
      cron: cron ?? null,
      running: this.running.has(name),
    }));
  }

  onApplicationBootstrap() {
    if (!this.config.get('ENABLE_INTERNAL_CRON', { infer: true })) {
      this.logger.log('Internal cron disabled; jobs run only via HTTP');
      return;
    }

    for (const job of this.jobs.values()) {
      if (!job.cron) continue;
      const cronJob = CronJob.from({
        cronTime: job.cron,
        timeZone: JOB_TIME_ZONE,
        onTick: () => {
          this.run(job.name, 'cron').catch(() => {
            // Already logged and recorded in job_runs by run().
          });
        },
      });
      this.schedulerRegistry.addCronJob(job.name, cronJob);
      cronJob.start();
      this.logger.log(`Scheduled "${job.name}" (${job.cron} ${JOB_TIME_ZONE})`);
    }
  }

  async run(name: string, trigger: JobTrigger) {
    const job = this.jobs.get(name);
    if (!job) throw new NotFoundException(`Unknown job "${name}"`);
    if (this.running.has(name)) {
      throw new ConflictException(`Job "${name}" is already running`);
    }

    this.running.add(name);
    const startedAt = Date.now();
    const [runRow] = await this.db
      .insert(jobRuns)
      .values({ jobName: name, trigger })
      .returning({ id: jobRuns.id });

    try {
      await job.run();
      await this.db
        .update(jobRuns)
        .set({ status: 'succeeded', finishedAt: new Date() })
        .where(eq(jobRuns.id, runRow.id));
      return { name, status: 'succeeded', durationMs: Date.now() - startedAt };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Job "${name}" failed: ${message}`);
      await this.db
        .update(jobRuns)
        .set({ status: 'failed', finishedAt: new Date(), error: message })
        .where(eq(jobRuns.id, runRow.id));
      throw error;
    } finally {
      this.running.delete(name);
    }
  }
}
