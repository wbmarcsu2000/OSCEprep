-- Migration: add drill-performance columns to an EXISTING osce-analytics DB.
-- (Fresh installs already get these from schema.sql.)
-- Run once against the remote D1:
--   wrangler d1 execute osce-analytics --remote --file=./migrations/001_drill_performance.sql
--
-- Safe to skip if you just (re)ran schema.sql on a brand-new database.
ALTER TABLE events ADD COLUMN pct INTEGER;
ALTER TABLE events ADD COLUMN advanced INTEGER;
