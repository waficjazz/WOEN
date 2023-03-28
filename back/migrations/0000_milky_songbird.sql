-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migraitons
/*
DO $$ BEGIN
 CREATE TYPE "STATUS" AS ENUM('success', 'failed', 'paused', 'skiped', 'running', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
	"id" serial NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "workflowTemplateParam" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"workflowTemplateId" integer NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"default" text DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS "container" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"commands" text[],
	"envs" text[],
	"workingDir" text[],
	"user" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"userId" integer,
	"projectId" integer
);

CREATE TABLE IF NOT EXISTS "_project_users" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "outputParams" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"jobTemplateId" integer
);

CREATE TABLE IF NOT EXISTS "_groupToproject" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "project" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"userId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "workflow_template" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"initJob" text DEFAULT 'init' NOT NULL,
	"placements" jsonb,
	"userId" integer,
	"projectId" integer
);

CREATE TABLE IF NOT EXISTS "job_template" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"containerId" integer,
	"successors" text[],
	"dependencies" text[],
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"workflowTemplateId" integer,
	"condition" text
);

CREATE TABLE IF NOT EXISTS "_group_users" (
	"A" integer NOT NULL,
	"B" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "workflow" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"totalJobs" integer DEFAULT 0 NOT NULL,
	"completedJobs" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"startedAt" timestamp(3),
	"finishedAt" timestamp(3),
	"status" STATUS DEFAULT 'pending' NOT NULL,
	"placements" jsonb,
	"workflowTemplateId" integer,
	"jidsMap" jsonb,
	"userId" integer,
	"projectId" integer
);

CREATE TABLE IF NOT EXISTS "outputParamsValue" (
	"id" serial NOT NULL,
	"value" text NOT NULL,
	"outputParamsId" integer NOT NULL,
	"jobId" integer,
	"workflowId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "group" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"userId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "workflowParam" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"workflowId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "job" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"status" STATUS DEFAULT 'pending' NOT NULL,
	"successors" text[] DEFAULT 'RRAY[',
	"dependencies" text[] DEFAULT 'RRAY[',
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"startedAt" timestamp(3),
	"finishedAt" timestamp(3),
	"workflowId" integer NOT NULL,
	"jobTemplateId" integer,
	"containerId" integer,
	"exitCode" integer,
	"containerInstance" text
);

CREATE TABLE IF NOT EXISTS "inputParams" (
	"id" serial NOT NULL,
	"name" text,
	"jobTemplateId" integer,
	"outputParamsId" integer NOT NULL
);

DO $$ BEGIN
 ALTER TABLE workflowTemplateParam ADD CONSTRAINT workflowTemplateParam_workflowTemplateId_fkey FOREIGN KEY ("workflowTemplateId") REFERENCES workflow_template("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE container ADD CONSTRAINT container_userId_fkey FOREIGN KEY ("userId") REFERENCES user("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE container ADD CONSTRAINT container_projectId_fkey FOREIGN KEY ("projectId") REFERENCES project("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE _project_users ADD CONSTRAINT _project_users_A_fkey FOREIGN KEY ("A") REFERENCES project("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE _project_users ADD CONSTRAINT _project_users_B_fkey FOREIGN KEY ("B") REFERENCES user("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE outputParams ADD CONSTRAINT outputParams_jobTemplateId_fkey FOREIGN KEY ("jobTemplateId") REFERENCES job_template("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE _groupToproject ADD CONSTRAINT _groupToproject_A_fkey FOREIGN KEY ("A") REFERENCES group("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE _groupToproject ADD CONSTRAINT _groupToproject_B_fkey FOREIGN KEY ("B") REFERENCES project("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE project ADD CONSTRAINT project_userId_fkey FOREIGN KEY ("userId") REFERENCES user("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE workflow_template ADD CONSTRAINT workflow_template_userId_fkey FOREIGN KEY ("userId") REFERENCES user("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE workflow_template ADD CONSTRAINT workflow_template_projectId_fkey FOREIGN KEY ("projectId") REFERENCES project("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE job_template ADD CONSTRAINT job_template_containerId_fkey FOREIGN KEY ("containerId") REFERENCES container("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE job_template ADD CONSTRAINT job_template_workflowTemplateId_fkey FOREIGN KEY ("workflowTemplateId") REFERENCES workflow_template("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE _group_users ADD CONSTRAINT _group_users_A_fkey FOREIGN KEY ("A") REFERENCES group("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE _group_users ADD CONSTRAINT _group_users_B_fkey FOREIGN KEY ("B") REFERENCES user("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE workflow ADD CONSTRAINT workflow_workflowTemplateId_fkey FOREIGN KEY ("workflowTemplateId") REFERENCES workflow_template("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE workflow ADD CONSTRAINT workflow_userId_fkey FOREIGN KEY ("userId") REFERENCES user("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE workflow ADD CONSTRAINT workflow_projectId_fkey FOREIGN KEY ("projectId") REFERENCES project("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE outputParamsValue ADD CONSTRAINT outputParamsValue_jobId_fkey FOREIGN KEY ("jobId") REFERENCES job("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE outputParamsValue ADD CONSTRAINT outputParamsValue_outputParamsId_fkey FOREIGN KEY ("outputParamsId") REFERENCES outputParams("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE group ADD CONSTRAINT group_userId_fkey FOREIGN KEY ("userId") REFERENCES user("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE workflowParam ADD CONSTRAINT workflowParam_workflowId_fkey FOREIGN KEY ("workflowId") REFERENCES workflow("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE job ADD CONSTRAINT job_workflowId_fkey FOREIGN KEY ("workflowId") REFERENCES workflow("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE job ADD CONSTRAINT job_jobTemplateId_fkey FOREIGN KEY ("jobTemplateId") REFERENCES job_template("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE job ADD CONSTRAINT job_containerId_fkey FOREIGN KEY ("containerId") REFERENCES container("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE inputParams ADD CONSTRAINT inputParams_outputParamsId_fkey FOREIGN KEY ("outputParamsId") REFERENCES outputParams("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE inputParams ADD CONSTRAINT inputParams_jobTemplateId_fkey FOREIGN KEY ("jobTemplateId") REFERENCES job_template("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS user_email_key ON user ("email");
CREATE UNIQUE INDEX IF NOT EXISTS user_username_key ON user ("username");
CREATE UNIQUE INDEX IF NOT EXISTS container_name_projectId_key ON container ("name","projectId");
CREATE UNIQUE INDEX IF NOT EXISTS _project_users_AB_unique ON _project_users ("A","B");
CREATE INDEX IF NOT EXISTS _project_users_B_index ON _project_users ("B");
CREATE UNIQUE INDEX IF NOT EXISTS _groupToproject_AB_unique ON _groupToproject ("A","B");
CREATE INDEX IF NOT EXISTS _groupToproject_B_index ON _groupToproject ("B");
CREATE UNIQUE INDEX IF NOT EXISTS project_name_userId_key ON project ("name","userId");
CREATE UNIQUE INDEX IF NOT EXISTS workflow_template_name_projectId_key ON workflow_template ("name","projectId");
CREATE UNIQUE INDEX IF NOT EXISTS _group_users_AB_unique ON _group_users ("A","B");
CREATE INDEX IF NOT EXISTS _group_users_B_index ON _group_users ("B");
*/