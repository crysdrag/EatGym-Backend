-- 004_daily_health_metrics.sql
-- Daily health and activity metrics (steps, calories burned, heart rate)
-- tracked per day (00:00 to 24:00) from smartwatch (e.g. Nothing X, Health Connect, Apple Health).

CREATE TABLE IF NOT EXISTS daily_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  steps INTEGER NOT NULL DEFAULT 0,
  calories_burned NUMERIC(8, 2) NOT NULL DEFAULT 0,
  heart_rate_avg INTEGER,
  active_minutes INTEGER DEFAULT 0,
  source VARCHAR(64) NOT NULL DEFAULT 'Nothing X',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_health_metrics_user_date_unique UNIQUE (user_id, log_date),
  CONSTRAINT daily_health_metrics_steps_nonnegative CHECK (steps >= 0),
  CONSTRAINT daily_health_metrics_calories_nonnegative CHECK (calories_burned >= 0),
  CONSTRAINT daily_health_metrics_heart_rate_range CHECK (heart_rate_avg IS NULL OR (heart_rate_avg BETWEEN 30 AND 250)),
  CONSTRAINT daily_health_metrics_active_minutes_nonnegative CHECK (active_minutes >= 0)
);

CREATE INDEX IF NOT EXISTS daily_health_metrics_user_date_idx ON daily_health_metrics (user_id, log_date DESC);
