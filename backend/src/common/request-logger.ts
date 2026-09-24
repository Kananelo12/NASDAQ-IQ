import { Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

const logger = new Logger('HTTP');

// Render polls this every few seconds; logging it would drown everything else.
const SILENT_PATHS = new Set(['/api/health']);

/**
 * Logs one line per request: method, path, status, duration and the signed-in user.
 * Plain Express middleware (not a Nest interceptor) so it also covers /api/auth/*,
 * which Better Auth handles outside Nest's router. Query strings are dropped because
 * OAuth callbacks carry one-time codes in them.
 */
export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.originalUrl.split('?')[0];
    if (SILENT_PATHS.has(path)) return next();

    const startedAt = performance.now();
    res.on('finish', () => {
      const ms = Math.round(performance.now() - startedAt);
      const email = (req as Request & { auth?: { user: { email: string } } })
        .auth?.user.email;
      const line = `${req.method} ${path} ${res.statusCode} ${ms}ms${email ? ` ${email}` : ''}`;

      if (res.statusCode >= 500) logger.error(line);
      else if (res.statusCode >= 400) logger.warn(line);
      else logger.log(line);
    });
    next();
  };
}
