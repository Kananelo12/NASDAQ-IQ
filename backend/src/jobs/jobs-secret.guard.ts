import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import type { Env } from '../config/env.js';

export const JOBS_SECRET_HEADER = 'x-jobs-secret';

@Injectable()
export class JobsSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Env, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = Buffer.from(request.header(JOBS_SECRET_HEADER) ?? '');
    const expected = Buffer.from(this.config.get('JOBS_SECRET', { infer: true }));

    if (
      provided.length !== expected.length ||
      !timingSafeEqual(provided, expected)
    ) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
