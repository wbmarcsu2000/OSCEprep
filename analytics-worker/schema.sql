-- One row per usage event. Run once:
--   wrangler d1 execute osce-analytics --remote --file=./schema.sql
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  received   INTEGER NOT NULL,      -- server time (ms) — used for all date math
  ts         INTEGER,              -- client time (ms)
  event      TEXT,
  screen     TEXT,
  category   TEXT,
  mode       TEXT,
  band       TEXT,
  difficulty TEXT,
  drilltype  TEXT,
  pct        INTEGER,            -- drill coverage score 0-100 (event='drill')
  advanced   INTEGER,            -- differential drill: 1=advanced list, 0=core
  provider   TEXT,
  device     TEXT,                 -- anonymous persistent id
  session    TEXT,
  country    TEXT,                 -- derived server-side from IP
  ua         TEXT,                 -- user-agent (truncated)
  ref        TEXT,
  lang       TEXT,
  app        TEXT,
  student_email TEXT,                 -- named sign-in (NULL for anonymous/pre-sign-in events)
  student_name  TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_event ON events(event);
CREATE INDEX IF NOT EXISTS idx_events_received ON events(received);
CREATE INDEX IF NOT EXISTS idx_events_device ON events(device);

-- Registered students (one row per Northwestern email that has signed in).
CREATE TABLE IF NOT EXISTS students (
  email      TEXT PRIMARY KEY,
  name       TEXT,
  first_seen INTEGER,
  last_seen  INTEGER,
  consent_at INTEGER,                 -- when they affirmatively consented
  device     TEXT,
  country    TEXT,
  ua         TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_student ON events(student_email, received);
