import { pgTable, pgEnum, pgSchema, AnyPgColumn, varchar, timestamp, text, integer, uniqueIndex, serial, foreignKey, boolean, index, jsonb } from "drizzle-orm/pg-core"

export const status = pgEnum("STATUS", ['success', 'failed', 'paused', 'skiped', 'running', 'pending'])

import { sql } from "drizzle-orm/sql"

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar("id", { length: 36 }).notNull(),
	checksum: varchar("checksum", { length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text("logs"),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").notNull(),
});

export const user = pgTable("user", {
	id: serial("id").notNull(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	username: text("username").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		emailKey: uniqueIndex("user_email_key").on(table.email),
		usernameKey: uniqueIndex("user_username_key").on(table.username),
	}
});

export const workflowTemplateParam = pgTable("workflowTemplateParam", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	workflowTemplateId: integer("workflowTemplateId").notNull().references(() => workflowTemplate.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	required: boolean("required").notNull(),
	default: text("default").default('').notNull(),
});

export const container = pgTable("container", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	image: text("image").notNull(),
	commands: text("commands").array(),
	envs: text("envs").array(),
	workingDir: text("workingDir").array(),
	user: text("user"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	userId: integer("userId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" } ),
	projectId: integer("projectId").references(() => project.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => {
	return {
		nameProjectIdKey: uniqueIndex("container_name_projectId_key").on(table.name, table.projectId),
	}
});

export const projectUsers = pgTable("_project_users", {
	a: integer("A").notNull().references(() => project.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	b: integer("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		abUnique: uniqueIndex("_project_users_AB_unique").on(table.a, table.b),
		bIdx: index().on(table.b),
	}
});

export const outputParams = pgTable("outputParams", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	path: text("path").notNull(),
	jobTemplateId: integer("jobTemplateId").references(() => jobTemplate.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const groupToproject = pgTable("_groupToproject", {
	a: integer("A").notNull().references(() => group.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	b: integer("B").notNull().references(() => project.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		abUnique: uniqueIndex("_groupToproject_AB_unique").on(table.a, table.b),
		bIdx: index().on(table.b),
	}
});

export const project = pgTable("project", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	userId: integer("userId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
},
(table) => {
	return {
		nameUserIdKey: uniqueIndex("project_name_userId_key").on(table.name, table.userId),
	}
});

export const workflowTemplate = pgTable("workflow_template", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	initJob: text("initJob").default('init').notNull(),
	placements: jsonb("placements"),
	userId: integer("userId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" } ),
	projectId: integer("projectId").references(() => project.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => {
	return {
		nameProjectIdKey: uniqueIndex("workflow_template_name_projectId_key").on(table.name, table.projectId),
	}
});

export const jobTemplate = pgTable("job_template", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	containerId: integer("containerId").references(() => container.id, { onDelete: "set null", onUpdate: "cascade" } ),
	successors: text("successors").array(),
	dependencies: text("dependencies").array(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	workflowTemplateId: integer("workflowTemplateId").references(() => workflowTemplate.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	condition: text("condition"),
});

export const groupUsers = pgTable("_group_users", {
	a: integer("A").notNull().references(() => group.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	b: integer("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		abUnique: uniqueIndex("_group_users_AB_unique").on(table.a, table.b),
		bIdx: index().on(table.b),
	}
});

export const workflow = pgTable("workflow", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	totalJobs: integer("totalJobs").notNull(),
	completedJobs: integer("completedJobs").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	startedAt: timestamp("startedAt", { precision: 3, mode: 'string' }),
	finishedAt: timestamp("finishedAt", { precision: 3, mode: 'string' }),
	status: status("status").default('pending').notNull(),
	placements: jsonb("placements"),
	workflowTemplateId: integer("workflowTemplateId").references(() => workflowTemplate.id, { onDelete: "set null", onUpdate: "cascade" } ),
	jidsMap: jsonb("jidsMap"),
	userId: integer("userId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" } ),
	projectId: integer("projectId").references(() => project.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const outputParamsValue = pgTable("outputParamsValue", {
	id: serial("id").notNull(),
	value: text("value").notNull(),
	outputParamsId: integer("outputParamsId").notNull().references(() => outputParams.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	jobId: integer("jobId").references(() => job.id, { onDelete: "set null", onUpdate: "cascade" } ),
	workflowId: integer("workflowId").notNull(),
});

export const group = pgTable("group", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	userId: integer("userId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
});

export const workflowParam = pgTable("workflowParam", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	value: text("value").notNull(),
	workflowId: integer("workflowId").notNull().references(() => workflow.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const job = pgTable("job", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	status: status("status").default('pending').notNull(),
	successors: text("successors").default('RRAY[').array(),
	dependencies: text("dependencies").default('RRAY[').array(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	startedAt: timestamp("startedAt", { precision: 3, mode: 'string' }),
	finishedAt: timestamp("finishedAt", { precision: 3, mode: 'string' }),
	workflowId: integer("workflowId").notNull().references(() => workflow.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	jobTemplateId: integer("jobTemplateId").references(() => jobTemplate.id, { onDelete: "set null", onUpdate: "cascade" } ),
	containerId: integer("containerId").references(() => container.id, { onDelete: "set null", onUpdate: "cascade" } ),
	exitCode: integer("exitCode"),
	containerInstance: text("containerInstance"),
});

export const inputParams = pgTable("inputParams", {
	id: serial("id").notNull(),
	name: text("name"),
	jobTemplateId: integer("jobTemplateId").references(() => jobTemplate.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	outputParamsId: integer("outputParamsId").notNull().references(() => outputParams.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});