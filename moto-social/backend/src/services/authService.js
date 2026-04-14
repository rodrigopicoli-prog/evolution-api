const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/pool');
const { env } = require('../config/env');
const { HttpError } = require('../utils/httpError');

async function register(data) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [data.email]);
  if (existing.rowCount > 0) {
    throw new HttpError(409, 'E-mail já cadastrado');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, city, state, profile_type, avatar_url, bio)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, name, email, city, state, profile_type, created_at`,
    [
      data.name,
      data.email,
      data.phone || null,
      passwordHash,
      data.city || null,
      data.state || null,
      data.profileType || 'user',
      data.avatarUrl || null,
      data.bio || null,
    ],
  );

  return result.rows[0];
}

async function login(email, password) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new HttpError(401, 'Credenciais inválidas');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new HttpError(401, 'Credenciais inválidas');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      profileType: user.profile_type,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: '7d' },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      state: user.state,
      profileType: user.profile_type,
      avatarUrl: user.avatar_url,
      bio: user.bio,
    },
  };
}

async function me(userId) {
  const result = await pool.query(
    `SELECT id, name, email, phone, city, state, profile_type, avatar_url, bio, created_at
     FROM users
     WHERE id = $1`,
    [userId],
  );
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Usuário não encontrado');
  }
  return result.rows[0];
}

module.exports = { register, login, me };
