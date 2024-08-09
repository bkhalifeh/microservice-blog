CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(64) NOT NULL,
	"email" varchar(254) NOT NULL,
	"password" char(96) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
