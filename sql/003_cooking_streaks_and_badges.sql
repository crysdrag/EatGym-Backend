-- 003_cooking_streaks_and_badges.sql
-- FR-5.2 / FR-5.3: cooking streaks and idempotent achievement awards.

CREATE TABLE IF NOT EXISTS meal_prep_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  servings INTEGER NOT NULL,
  notes VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT meal_prep_batches_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT meal_prep_batches_servings_positive CHECK (servings BETWEEN 1 AND 100)
);

CREATE TABLE IF NOT EXISTS cooking_days (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cooked_on DATE NOT NULL,
  meal_prep_batch_id UUID REFERENCES meal_prep_batches(id) ON DELETE SET NULL,
  note VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, cooked_on),
  CONSTRAINT cooking_days_note_length CHECK (note IS NULL OR length(note) <= 500)
);

CREATE INDEX IF NOT EXISTS cooking_days_user_date_desc_idx ON cooking_days (user_id, cooked_on DESC);

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(300) NOT NULL,
  required_streak_days INTEGER NOT NULL UNIQUE,
  points INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT badges_code_not_blank CHECK (length(trim(code)) > 0),
  CONSTRAINT badges_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT badges_description_not_blank CHECK (length(trim(description)) > 0),
  CONSTRAINT badges_required_streak_positive CHECK (required_streak_days > 0),
  CONSTRAINT badges_points_nonnegative CHECK (points >= 0)
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
  awarded_for_streak_days INTEGER NOT NULL,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id),
  CONSTRAINT user_badges_awarded_streak_positive CHECK (awarded_for_streak_days > 0)
);

CREATE INDEX IF NOT EXISTS user_badges_user_awarded_idx ON user_badges (user_id, awarded_at DESC);

INSERT INTO badges (code, name, description, required_streak_days, points)
VALUES
  ('COOKING_STARTER_3', 'Khởi động bếp núc', 'Tự nấu liên tục 3 ngày.', 3, 10),
  ('COOKING_WEEK_7', 'Bếp trưởng 7 ngày', 'Tự nấu liên tục 7 ngày.', 7, 30),
  ('COOKING_CHAMPION_30', 'Chiến binh Meal Prep', 'Tự nấu liên tục 30 ngày.', 30, 150)
ON CONFLICT (code) DO NOTHING;
