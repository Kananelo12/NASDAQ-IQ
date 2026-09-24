import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { Env } from '../config/env.js';
import type { Auth } from './auth.js';
import { AuthGuard } from './auth.guard.js';

describe('AuthGuard', () => {
  const getSession = vi.fn();
  const auth = { api: { getSession } } as unknown as Auth;
  const config = {
    get: () => ['allowed@example.com'],
  } as unknown as ConfigService<Env, true>;
  const reflector = { getAllAndOverride: vi.fn() };
  const guard = new AuthGuard(
    auth,
    reflector as unknown as Reflector,
    config,
  );

  let request: Record<string, unknown>;
  const context = {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    request = { headers: {} };
    getSession.mockReset();
    reflector.getAllAndOverride.mockReturnValue(false);
  });

  it('lets @Public() routes through without a session lookup', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(getSession).not.toHaveBeenCalled();
  });

  it('rejects requests without a session', async () => {
    getSession.mockResolvedValue(null);
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects signed-in users who are not on the allowlist', async () => {
    getSession.mockResolvedValue({ user: { email: 'someone@example.com' } });
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('allows allowlisted users, case-insensitively, and attaches the session', async () => {
    const session = { user: { email: 'Allowed@Example.com' } };
    getSession.mockResolvedValue(session);
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.auth).toBe(session);
  });
});
