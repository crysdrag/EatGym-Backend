import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';
import { ApiError } from '../errors.js';
import { signAccessToken } from '../auth/jwt.js';
import { requireAuth } from '../middleware/auth.js';
import { validateLogin, validateRegistration } from '../validation.js';

const router = Router();
const PASSWORD_HASH_ROUNDS = 12;

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, fullName, password } = validateRegistration(req.body);
    const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (email, full_name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [email, fullName, passwordHash]
    );
    const user = publicUser(result.rows[0]);
    res.status(201).json({ user, accessToken: signAccessToken(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = validateLogin(req.body);
    const result = await pool.query(
      `SELECT id, email, full_name, password_hash, role, is_active, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );
    const row = result.rows[0];
    if (!row || !row.is_active || !(await bcrypt.compare(password, row.password_hash))) {
      throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [row.id]);
    const user = publicUser(row);
    res.json({ user, accessToken: signAccessToken(user) });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    res.json({
      user: {
        id: req.auth.userId,
        email: req.auth.email,
        fullName: req.auth.fullName,
        role: req.auth.role,
        isActive: true,
        createdAt: req.auth.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
