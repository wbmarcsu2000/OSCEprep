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
  provider   TEXT,
  device     TEXT,                 -- anonymous persistent id
  session    TEXT,
  country    TEXT,                 -- derived server-side from IP
  ua         TEXT,                 -- user-agent (truncated)
  ref        TEXT,
  lang       TEXT,
  app        TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_event ON events(event);
CREATE INDEX IF NOT EXISTS idx_events_received ON events(received);
CREATE INDEX IF NOT EXISTS idx_events_device ON events(device);
