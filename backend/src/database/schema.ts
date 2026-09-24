import {
  bigint,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

/*
 * Point-in-time rule (PRD §15): facts are append-only and carry `knownAt`, the moment the
 * value became publicly available. Historical queries must filter on
 * `knownAt < <event time>` so backtests never see information from the future.
 */

const timestamptz = (name: string) => timestamp(name, { withTimezone: true });

export const eventDefinitions = pgTable('event_definitions', {
  id: serial('id').primaryKey(),
  // Stable identifier, e.g. US_CPI_CORE_MOM. One row per market-moving component.
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  country: text('country').notNull().default('US'),
  unit: text('unit').notNull(),
  importance: smallint('importance').notNull().default(1),
  createdAt: timestamptz('created_at').notNull().defaultNow(),
});

export const eventReleases = pgTable(
  'event_releases',
  {
    id: serial('id').primaryKey(),
    eventDefinitionId: integer('event_definition_id')
      .notNull()
      .references(() => eventDefinitions.id),
    // Period the data describes, e.g. '2026-08' for August CPI.
    referencePeriod: text('reference_period').notNull(),
    scheduledAt: timestamptz('scheduled_at').notNull(),
    releasedAt: timestamptz('released_at'),
  },
  (t) => [
    unique().on(t.eventDefinitionId, t.referencePeriod),
    index().on(t.scheduledAt),
  ],
);

export const releaseValueKind = pgEnum('release_value_kind', [
  'previous',
  'consensus',
  'actual',
  'revision',
]);

// Append-only: a changed consensus or a revised actual is a new row, never an update.
export const releaseValues = pgTable(
  'release_values',
  {
    id: serial('id').primaryKey(),
    releaseId: integer('release_id')
      .notNull()
      .references(() => eventReleases.id),
    kind: releaseValueKind('kind').notNull(),
    value: doublePrecision('value').notNull(),
    knownAt: timestamptz('known_at').notNull(),
    source: text('source').notNull(),
    sourceRef: text('source_ref'),
    recordedAt: timestamptz('recorded_at').notNull().defaultNow(),
  },
  (t) => [index().on(t.releaseId, t.kind, t.knownAt)],
);

export const marketBars = pgTable(
  'market_bars',
  {
    symbol: text('symbol').notNull(),
    timeframe: text('timeframe').notNull(),
    // Bar open time.
    ts: timestamptz('ts').notNull(),
    open: doublePrecision('open').notNull(),
    high: doublePrecision('high').notNull(),
    low: doublePrecision('low').notNull(),
    close: doublePrecision('close').notNull(),
    volume: bigint('volume', { mode: 'number' }),
    source: text('source').notNull(),
  },
  (t) => [primaryKey({ columns: [t.symbol, t.timeframe, t.ts] })],
);

export const fedCommunicationKind = pgEnum('fed_communication_kind', [
  'statement',
  'minutes',
  'speech',
  'testimony',
  'interview',
  'press_conference',
]);

export const fedCommunications = pgTable(
  'fed_communications',
  {
    id: serial('id').primaryKey(),
    kind: fedCommunicationKind('kind').notNull(),
    speaker: text('speaker'),
    role: text('role'),
    title: text('title').notNull(),
    occurredAt: timestamptz('occurred_at').notNull(),
    knownAt: timestamptz('known_at').notNull(),
    sourceUrl: text('source_url').notNull().unique(),
    body: text('body'),
    recordedAt: timestamptz('recorded_at').notNull().defaultNow(),
  },
  (t) => [index().on(t.occurredAt), index().on(t.speaker, t.occurredAt)],
);

export const jobRunStatus = pgEnum('job_run_status', [
  'running',
  'succeeded',
  'failed',
]);

export const jobRuns = pgTable(
  'job_runs',
  {
    id: serial('id').primaryKey(),
    jobName: text('job_name').notNull(),
    // 'cron' (in-process) or 'http' (GitHub Actions / manual).
    trigger: text('trigger').notNull(),
    status: jobRunStatus('status').notNull().default('running'),
    startedAt: timestamptz('started_at').notNull().defaultNow(),
    finishedAt: timestamptz('finished_at'),
    error: text('error'),
  },
  (t) => [index().on(t.jobName, t.startedAt)],
);
