-- Migration: add student-identity columns + the students registry to an
-- EXISTING osce-analytics DB. (Fresh installs get these from schema.sql.)
-- Run once against the remote D1:
--   wrangler d1 execute osce-analytics --remote --file=./migrations/002_student_identity.sql
ALTER TABLE events ADD COLUMN student_email TEXT;
ALTER TABLE events ADD COLUMN student_name TEXT;

CREATE TABLE IF NOT EXISTS students (
  email      TEXT PRIMARY KEY,
  name       TEXT,
  first_seen INTEGER,
  last_seen  INTEGER,
  consent_at INTEGER,
  device     TEXT,
  country    TEXT,
  ua         TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_student ON events(student_email, received);
