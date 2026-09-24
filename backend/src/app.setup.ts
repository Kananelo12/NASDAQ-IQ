import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { toNodeHandler } from 'better-auth/node';
import { AUTH, type Auth } from './auth/auth.js';
import type { Env } from './config/env.js';

/**
 * Shared by main.ts and the e2e tests. The app must be created with
 * `{ bodyParser: false }`: Better Auth reads raw request bodies, so its handler is
 * mounted before Nest's JSON parser is registered.
 */
export function configureApp(app: NestExpressApplication) {
  const config = app.get(ConfigService<Env, true>);
  const auth = app.get<Auth>(AUTH);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config.get('APP_URL', { infer: true }),
    credentials: true,
  });

  app.getHttpAdapter().getInstance().all('/api/auth/*splat', toNodeHandler(auth));
  app.useBodyParser('json');
  app.useBodyParser('urlencoded', { extended: true });

  app.enableShutdownHooks();
}
