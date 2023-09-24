-- Add new schema named "public"
CREATE SCHEMA IF NOT EXISTS "public";

-- Set comment to schema: "public"
COMMENT ON SCHEMA "public" IS 'standard public schema';

-- Create "booking_periods" table
CREATE TABLE IF NOT EXISTS "public"."booking_periods"
  (
     "id"         TEXT NOT NULL,
     "from"       TIMESTAMPTZ NULL,
     "to"         TIMESTAMPTZ NULL,
     "created_at" TIMESTAMPTZ NULL,
     "updated_at" TIMESTAMPTZ NULL,
     "deleted_at" TIMESTAMPTZ NULL,
     PRIMARY KEY ("id")
  );

-- Create index "idx_booking_periods_deleted_at" to table: "booking_periods"
CREATE INDEX IF NOT EXISTS "idx_booking_periods_deleted_at"
  ON "public"."booking_periods" ("deleted_at");

-- Create "roles" table
CREATE TABLE IF NOT EXISTS "public"."roles"
  (
     "id"          BIGSERIAL NOT NULL,
     "name"        TEXT NULL,
     "description" TEXT NULL,
     "created_at"  TIMESTAMPTZ NULL,
     "updated_at"  TIMESTAMPTZ NULL,
     "deleted_at"  TIMESTAMPTZ NULL,
     PRIMARY KEY ("id")
  );

-- Create index "idx_roles_deleted_at" to table: "roles"
CREATE INDEX IF NOT EXISTS "idx_roles_deleted_at"
  ON "public"."roles" ("deleted_at");

-- Create "users" table
CREATE TABLE IF NOT EXISTS "public"."users"
  (
     "id"            TEXT NOT NULL,
     "first_name"    TEXT NULL,
     "last_name"     TEXT NULL,
     "email"         TEXT NULL,
     "hash_password" TEXT NULL,
     "role_id"       BIGINT NULL,
     "user_name"     TEXT NULL,
     "created_at"    TIMESTAMPTZ NULL,
     "updated_at"    TIMESTAMPTZ NULL,
     "deleted_at"    TIMESTAMPTZ NULL,
     PRIMARY KEY ("id"),
     CONSTRAINT "fk_users_role" FOREIGN KEY ("role_id") REFERENCES
     "public"."roles" ("id") ON UPDATE NO action ON DELETE NO action
  );

-- Create index "idx_users_deleted_at" to table: "users"
CREATE INDEX IF NOT EXISTS "idx_users_deleted_at"
  ON "public"."users" ("deleted_at");

-- Create "bookings" table
CREATE TABLE IF NOT EXISTS "public"."bookings"
  (
     "id"                TEXT NOT NULL,
     "booking_period_id" TEXT NULL,
     "user_id"           TEXT NULL,
     "date"              TIMESTAMPTZ NULL,
     "created_at"        TIMESTAMPTZ NULL,
     "updated_at"        TIMESTAMPTZ NULL,
     "deleted_at"        TIMESTAMPTZ NULL,
     PRIMARY KEY ("id"),
     CONSTRAINT "fk_bookings_user" FOREIGN KEY ("user_id") REFERENCES
     "public"."users" ("id") ON UPDATE NO action ON DELETE NO action
  );

-- Create index "idx_bookings_deleted_at" to table: "bookings"
CREATE INDEX IF NOT EXISTS "idx_bookings_deleted_at"
  ON "public"."bookings" ("deleted_at"); 