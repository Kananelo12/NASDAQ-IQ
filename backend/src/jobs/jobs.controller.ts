import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JobsSecretGuard } from './jobs-secret.guard.js';
import { JobsService } from './jobs.service.js';

@Controller('jobs')
@UseGuards(JobsSecretGuard)
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  list() {
    return this.jobs.list();
  }

  @Post(':name/run')
  @HttpCode(200)
  run(@Param('name') name: string) {
    return this.jobs.run(name, 'http');
  }
}
