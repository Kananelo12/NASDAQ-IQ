import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgres://test:test@localhost:5432/test',
      JOBS_SECRET: 'e2e-test-secret-value',
      ENABLE_INTERNAL_CRON: 'false',
      BETTER_AUTH_SECRET: 'e2e-test-better-auth-secret-0123456789',
      GOOGLE_CLIENT_ID: 'e2e-google-client-id',
      GOOGLE_CLIENT_SECRET: 'e2e-google-client-secret',
      ALLOWED_EMAILS: 'allowed@example.com',
    },
  },
});
