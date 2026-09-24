# NASDAQ Macro Intelligence

Macro event scenarios and historical NASDAQ reactions. Product spec: [docs/NASDAQ_Macro_Intelligence_PRD.md](docs/NASDAQ_Macro_Intelligence_PRD.md).

| Folder | What | Stack |
|---|---|---|
| `frontend/` | Web dashboard | React, Vite, TanStack Query, React Router |
| `backend/` | API and scheduled jobs | NestJS, Drizzle ORM, PostgreSQL (Neon), Gemini |

npm workspaces: run `npm install` once at the root.

## Local setup

1. Create a free Postgres database on [Neon](https://neon.tech) and copy its connection string.
2. `cp backend/.env.example backend/.env` and fill in `DATABASE_URL` and `JOBS_SECRET`. `GEMINI_API_KEY` is optional until LLM features exist.
3. Apply the schema: `npm run db:migrate -w backend`
4. `npm run dev` starts the API on :3000 and the dashboard on :5173 (Vite proxies `/api`).

## Scripts (root)

| Command | Does |
|---|---|
| `npm run dev` | API + dashboard in watch mode |
| `npm run build` | Build both apps |
| `npm run lint` | oxlint in both apps |
| `npm test` | Backend unit tests (`npm run test:e2e -w backend` for e2e) |
| `npm run db:generate -w backend` | Create a migration after editing `backend/src/database/schema.ts` |
| `npm run db:migrate -w backend` | Apply pending migrations |
| `npm run db:studio -w backend` | Browse the database |

## Backend conventions

- **Point-in-time data.** Facts are append-only and carry `known_at`, the time the value became public. Historical queries must filter `known_at < event time` so backtests can't see the future (PRD §15). Never update a consensus or actual in place: insert a new row.
- **Jobs.** Feature modules register jobs with `JobsService.register({ name, cron, run })`. Each job runs on its cron schedule (US Eastern) and can also be triggered with `POST /api/jobs/:name/run` and the `x-jobs-secret` header. Runs are recorded in `job_runs`.
- **LLM.** Inject `LlmService`, never a provider class. It explains source material and never supplies economic values.

## Deployment (Render)

`render.yaml` defines both services. Create them with Render > New > Blueprint.

- **API**: Starter plan (always on), so in-process cron runs. Migrations run in `preDeployCommand`.
- **Dashboard**: free static site with SPA rewrites.
- After the first deploy, set `CORS_ORIGIN` on the API to the static site URL and `VITE_API_URL` on the static site to the API URL, then redeploy the static site.

**Fallback if the API moves to a free (sleeping) plan:** `.github/workflows/scheduled-jobs.yml` wakes the API and triggers jobs over HTTP. The setup steps are at the top of that file.

## Deferred

Redis + BullMQ were left out of the MVP. Add them when jobs need retries, long backfills, concurrency control or a separate worker process.
