CREATE TYPE "public"."fed_communication_kind" AS ENUM('statement', 'minutes', 'speech', 'testimony', 'interview', 'press_conference');--> statement-breakpoint
CREATE TYPE "public"."job_run_status" AS ENUM('running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."release_value_kind" AS ENUM('previous', 'consensus', 'actual', 'revision');--> statement-breakpoint
CREATE TABLE "event_definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"country" text DEFAULT 'US' NOT NULL,
	"unit" text NOT NULL,
	"importance" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_definitions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "event_releases" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_definition_id" integer NOT NULL,
	"reference_period" text NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"released_at" timestamp with time zone,
	CONSTRAINT "event_releases_event_definition_id_reference_period_unique" UNIQUE("event_definition_id","reference_period")
);
--> statement-breakpoint
CREATE TABLE "fed_communications" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "fed_communication_kind" NOT NULL,
	"speaker" text,
	"role" text,
	"title" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"known_at" timestamp with time zone NOT NULL,
	"source_url" text NOT NULL,
	"body" text,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fed_communications_source_url_unique" UNIQUE("source_url")
);
--> statement-breakpoint
CREATE TABLE "job_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_name" text NOT NULL,
	"trigger" text NOT NULL,
	"status" "job_run_status" DEFAULT 'running' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "market_bars" (
	"symbol" text NOT NULL,
	"timeframe" text NOT NULL,
	"ts" timestamp with time zone NOT NULL,
	"open" double precision NOT NULL,
	"high" double precision NOT NULL,
	"low" double precision NOT NULL,
	"close" double precision NOT NULL,
	"volume" bigint,
	"source" text NOT NULL,
	CONSTRAINT "market_bars_symbol_timeframe_ts_pk" PRIMARY KEY("symbol","timeframe","ts")
);
--> statement-breakpoint
CREATE TABLE "release_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"release_id" integer NOT NULL,
	"kind" "release_value_kind" NOT NULL,
	"value" double precision NOT NULL,
	"known_at" timestamp with time zone NOT NULL,
	"source" text NOT NULL,
	"source_ref" text,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_releases" ADD CONSTRAINT "event_releases_event_definition_id_event_definitions_id_fk" FOREIGN KEY ("event_definition_id") REFERENCES "public"."event_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release_values" ADD CONSTRAINT "release_values_release_id_event_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."event_releases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_releases_scheduled_at_index" ON "event_releases" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "fed_communications_occurred_at_index" ON "fed_communications" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "fed_communications_speaker_occurred_at_index" ON "fed_communications" USING btree ("speaker","occurred_at");--> statement-breakpoint
CREATE INDEX "job_runs_job_name_started_at_index" ON "job_runs" USING btree ("job_name","started_at");--> statement-breakpoint
CREATE INDEX "release_values_release_id_kind_known_at_index" ON "release_values" USING btree ("release_id","kind","known_at");