# EatGym API

Backend foundation for the report's FR-1.1/FR-1.2 and UC-1.2: accounts, JWT-protected APIs, a one-to-one physical profile, and Mifflin-St Jeor BMR/TDEE calculation.

For a Vietnamese step-by-step setup guide (including Docker, environment
variables, migrations, and PowerShell API examples), see `HUONG_DAN_CAI_DAT.txt`.

## Run locally

1. Copy `.env.example` to `.env` and set a unique `JWT_SECRET` (32+ characters).
2. Start PostgreSQL with `docker compose up -d postgres`, or provide your own `DATABASE_URL`.
3. Install packages with `pnpm install`.
4. Apply the schema: `pnpm migrate`.
5. Start the API: `pnpm dev`.

Run the formula tests with `pnpm test`.

## Data model

- `users`: case-insensitive unique email, bcrypt password hash, role (`user`/`admin`), and active flag.
- `user_profiles`: exactly one current body profile per user. It stores sex, date of birth, height, weight, activity level, fitness goal, and the latest calculated BMR/TDEE snapshot. Deleting a user removes their profile.
- `schema_migrations`: records applied SQL migrations and prevents silently changing a previously applied migration.

The schema uses PostgreSQL constraints for valid anthropometric ranges and enum values. No password or password hash is returned by the API.

## Authentication

`POST /api/auth/register`

```json
{ "email": "an@example.com", "fullName": "Nguyễn Văn An", "password": "strong-password" }
```

`POST /api/auth/login`

```json
{ "email": "an@example.com", "password": "strong-password" }
```

Both return `{ "user": { ... }, "accessToken": "..." }`. Supply the token to protected endpoints as:

```http
Authorization: Bearer <accessToken>
```

`GET /api/auth/me` returns the authenticated account. JWTs include the account ID as `sub`, role, issuer and audience, and are validated for all of those values. Each protected request also loads the current account, so a disabled account loses API access immediately instead of remaining active until its token expires. `requireRole('admin')` is available for future administrative routes.

## Physical profile and calculation

`PUT /api/profile` creates or replaces the authenticated user's physical profile and persists the calculation.

```json
{
  "sex": "male",
  "dateOfBirth": "1996-06-12",
  "heightCm": 175,
  "weightKg": 72.5,
  "activityLevel": "moderate",
  "fitnessGoal": "cutting"
}
```

`GET /api/profile` retrieves it. `POST /api/nutrition/calculate` performs a protected calculation preview without persisting it. Its body is `sex`, integer `age`, `heightCm`, `weightKg`, and `activityLevel` (plus optional `fitnessGoal`); it does not require `dateOfBirth`.

Mifflin-St Jeor is implemented as:

```text
male:   BMR = 10 × weightKg + 6.25 × heightCm − 5 × age + 5
female: BMR = 10 × weightKg + 6.25 × heightCm − 5 × age − 161
TDEE = BMR × activity multiplier
```

Supported PAL values: `sedentary` 1.20, `light` 1.375, `moderate` 1.55, `active` 1.725, and `very_active` 1.90. Results are rounded to two decimal places in kcal/day.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | No | Liveness check |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Sign in and receive JWT |
| GET | `/api/auth/me` | Bearer JWT | Current account |
| GET | `/api/profile` | Bearer JWT | Current physical profile |
| PUT | `/api/profile` | Bearer JWT | Create/update profile; calculate and save BMR/TDEE |
| POST | `/api/nutrition/calculate` | Bearer JWT | BMR/TDEE calculation preview |
