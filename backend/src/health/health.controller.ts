import { Controller, Get, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DB, type Database } from '../database/database.module.js';

@Controller('health')
export class HealthController {
  constructor(@Inject(DB) private readonly db: Database) {}

  // Liveness probe for Render. Deliberately does not touch the database.
  @Get()
  check() {
    return { status: 'ok', time: new Date().toISOString() };
  }

  @Get('db')
  async checkDb() {
    try {
      await this.db.execute(sql`select 1`);
      return { database: 'ok' };
    } catch (error) {
      // Drizzle wraps driver errors; the cause has the useful message.
      const { message, cause } = error as Error;
      return {
        database: 'error',
        message: cause instanceof Error ? cause.message : message,
      };
    }
  }
}
