import { Logger } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import type { Env } from '../config/env.js';
import type { Database } from '../database/database.module.js';
import * as authSchema from '../database/auth-schema.js';

export const AUTH = Symbol('AUTH');

export function isEmailAllowed(email: string, allowedEmails: string[]) {
  return allowedEmails.includes(email.trim().toLowerCase());
}

type AuthEnv = Pick<
  Env,
  | 'APP_URL'
  | 'BETTER_AUTH_SECRET'
  | 'GOOGLE_CLIENT_ID'
  | 'GOOGLE_CLIENT_SECRET'
  | 'ALLOWED_EMAILS'
>;

/**
 * Google sign-in only, restricted to ALLOWED_EMAILS. Unknown accounts are rejected
 * before a user row is created; AuthGuard re-checks the list on every request so
 * removing an email revokes access immediately.
 */
export function createAuth(db: Database, env: AuthEnv) {
  const logger = new Logger('Auth');

  return betterAuth({
    // Route Better Auth's own messages (OAuth errors, misconfiguration) through Nest's logger.
    logger: {
      level: 'info',
      log: (level, message, ...args) => {
        const text = [message, ...args.map(formatLogArg)].join(' ');
        if (level === 'error') logger.error(text);
        else if (level === 'warn') logger.warn(text);
        else if (level === 'debug') logger.debug(text);
        else logger.log(text);
      },
    },
    appName: 'NASDAQ Macro Intelligence',
    baseURL: env.APP_URL,
    basePath: '/api/auth',
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.APP_URL],
    database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        prompt: 'select_account',
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!isEmailAllowed(user.email, env.ALLOWED_EMAILS)) {
              logger.warn(
                `Sign-in rejected: ${user.email} is not in ALLOWED_EMAILS`,
              );
              throw new APIError('FORBIDDEN', {
                message: 'This account is not allowed to use the app',
              });
            }
          },
        },
      },
    },
  });
}

function formatLogArg(arg: unknown) {
  if (arg instanceof Error) return arg.stack ?? arg.message;
  return typeof arg === 'string' ? arg : JSON.stringify(arg);
}

export type Auth = ReturnType<typeof createAuth>;
export type AuthSession = Auth['$Infer']['Session'];
