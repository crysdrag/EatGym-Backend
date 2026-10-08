-- EatGym's account and physical-profile foundation.
-- The physical profile is intentionally one-to-one with a user, as specified
-- by the system document. BMR/TDEE are cached snapshots and recalculated by
-- the application whenever the profile changes.

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE biological_sex AS ENUM ('male', 'female');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE activity_level AS ENUM (
    'sedentary',
    'light',
    'moderate',
    'active',
    'very_active'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE fitness_goal AS ENUM (
    'bulking',
    'cutting',
    'maintenance',
    'iifym',
    'carb_cycling'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_not_blank CHECK (length(trim(email::text)) > 0),
  CONSTRAINT users_password_hash_not_blank CHECK (length(password_hash) > 0)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  sex biological_sex NOT NULL,
  date_of_birth DATE NOT NULL,
  height_cm NUMERIC(5, 2) NOT NULL,
  weight_kg NUMERIC(5, 2) NOT NULL,
  activity_level activity_level NOT NULL,
  fitness_goal fitness_goal NOT NULL DEFAULT 'maintenance',
  bmr_kcal NUMERIC(8, 2) NOT NULL,
  tdee_kcal NUMERIC(8, 2) NOT NULL,
  calculation_version VARCHAR(32) NOT NULL DEFAULT 'mifflin-st-jeor-v1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- PostgreSQL CHECK expressions must be immutable; the application verifies
  -- that the date is in the past and results in an age from 13 to 120.
  CONSTRAINT profile_birth_date_range CHECK (date_of_birth >= DATE '1900-01-01'),
  CONSTRAINT profile_height_range CHECK (height_cm >= 50 AND height_cm <= 300),
  CONSTRAINT profile_weight_range CHECK (weight_kg >= 10 AND weight_kg <= 500),
  CONSTRAINT profile_bmr_positive CHECK (bmr_kcal > 0),
  CONSTRAINT profile_tdee_positive CHECK (tdee_kcal > 0)
);

CREATE INDEX IF NOT EXISTS users_active_idx ON users (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS user_profiles_goal_idx ON user_profiles (fitness_goal);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS user_profiles_set_updated_at ON user_profiles;
CREATE TRIGGER user_profiles_set_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
