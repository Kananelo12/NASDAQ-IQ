import { z } from 'zod';

const booleanString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const emailList = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
  .pipe(z.array(z.email()).min(1));

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  // Public origin users open in the browser (the frontend). The API is served under
  // <APP_URL>/api through the Vite proxy locally and a Render rewrite in production.
  APP_URL: z.url().default('http://localhost:5173'),
  // Shared secret for POST /api/jobs/* (used by the GitHub Actions fallback scheduler).
  JOBS_SECRET: z.string().min(16),
  // Run scheduled jobs in-process. Set to false if the API moves to a plan that sleeps
  // and the GitHub Actions workflow is triggering jobs instead.
  ENABLE_INTERNAL_CRON: booleanString.default(true),
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  // Comma-separated Google account emails allowed to use the app.
  ALLOWED_EMAILS: emailList,
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
