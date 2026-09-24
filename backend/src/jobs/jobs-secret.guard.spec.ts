import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.js';
import { JobsSecretGuard } from './jobs-secret.guard.js';

const SECRET = 'a-very-long-test-secret';

function contextWithHeader(value?: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ header: () => value }),
    }),
  } as unknown as ExecutionContext;
}

describe('JobsSecretGuard', () => {
  const guard = new JobsSecretGuard({
    get: () => SECRET,
  } as unknown as ConfigService<Env, true>);

  it('allows the correct secret', () => {
    expect(guard.canActivate(contextWithHeader(SECRET))).toBe(true);
  });

  it.each([undefined, '', 'wrong', `${SECRET}x`])(
    'rejects %p',
    (value) => {
      expect(() => guard.canActivate(contextWithHeader(value))).toThrow(
        UnauthorizedException,
      );
    },
  );
});
