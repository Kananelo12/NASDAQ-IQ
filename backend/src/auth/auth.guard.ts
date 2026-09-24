import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import type { Env } from '../config/env.js';
import { AUTH, isEmailAllowed, type Auth, type AuthSession } from './auth.js';
import { IS_PUBLIC } from './public.decorator.js';

export type AuthenticatedRequest = Request & { auth: AuthSession };

// Registered globally: every route requires an allowed, signed-in user unless @Public().
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH) private readonly auth: Auth,
    private readonly reflector: Reflector,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = await this.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) throw new UnauthorizedException();

    const allowedEmails = this.config.get('ALLOWED_EMAILS', { infer: true });
    if (!isEmailAllowed(session.user.email, allowedEmails)) {
      throw new ForbiddenException('This account is not allowed to use the app');
    }

    request.auth = session;
    return true;
  }
}
