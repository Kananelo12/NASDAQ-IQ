import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import type { Env } from '../config/env.js';
import { DB, type Database } from '../database/database.module.js';
import { AUTH, createAuth } from './auth.js';
import { AuthGuard } from './auth.guard.js';
import { MeController } from './me.controller.js';

@Global()
@Module({
  controllers: [MeController],
  providers: [
    {
      provide: AUTH,
      inject: [DB, ConfigService],
      useFactory: (db: Database, config: ConfigService<Env, true>) =>
        createAuth(db, {
          APP_URL: config.get('APP_URL', { infer: true }),
          BETTER_AUTH_SECRET: config.get('BETTER_AUTH_SECRET', { infer: true }),
          GOOGLE_CLIENT_ID: config.get('GOOGLE_CLIENT_ID', { infer: true }),
          GOOGLE_CLIENT_SECRET: config.get('GOOGLE_CLIENT_SECRET', {
            infer: true,
          }),
          ALLOWED_EMAILS: config.get('ALLOWED_EMAILS', { infer: true }),
        }),
    },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [AUTH],
})
export class AuthModule {}
