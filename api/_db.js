/* global process */
import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL_DATABASE_URL || process.env.DATABASE_URL)

let ready
// Creates the events table on first use. One row per tracked event; no IPs are stored.
export function ensureSchema() {
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS events (
      id         BIGSERIAL PRIMARY KEY,
      ts         TIMESTAMPTZ NOT NULL DEFAULT now(),
      vid        TEXT NOT NULL,
      sid        TEXT NOT NULL,
      type       TEXT NOT NULL,
      path       TEXT NOT NULL,
      label      TEXT,
      value      INTEGER,
      referrer   TEXT,
      city       TEXT,
      region     TEXT,
      country    TEXT,
      device     TEXT
    )`.then(() => sql`CREATE INDEX IF NOT EXISTS events_ts ON events (ts)`)
  return ready
}
