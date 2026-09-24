import { z } from 'zod';

const booleanString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  // Comma-separated list of allowed browser origins.
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  // Shared secret for POST /api/jobs/* (used by the GitHub Actions fallback scheduler).
  JOBS_SECRET: z.string().min(16),
  // Run scheduled jobs in-process. Set to false if the API moves to a plan that sleeps
  // and the GitHub Actions workflow is triggering jobs instead.
  ENABLE_INTERNAL_CRON: booleanString.default(true),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-flash-latest'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
