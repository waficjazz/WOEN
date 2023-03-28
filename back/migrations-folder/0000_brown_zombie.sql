CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"username" text,
	"email" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
