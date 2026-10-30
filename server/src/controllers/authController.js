// server/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getSupabaseClient } from '../config/database.js';

const SALT_ROUNDS = 12;

// In-memory fallback for guest / testing if database table is not migrated yet
const memoryUsers = new Map();

export async function register(req, res) {
  const { email, password } = req.body;
  const secret = process.env.JWT_SECRET || 'sentinel_default_secret_key_minimum_32_characters';

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = crypto.randomUUID();
    const supabase = getSupabaseClient();

    let savedToDb = false;

    if (supabase) {
      try {
        const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
        if (existing) {
          return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        }

        const { error: insertErr } = await supabase.from('users').insert({
          id: userId,
          email,
          password_hash: passwordHash
        });

        if (!insertErr) {
          savedToDb = true;
          await supabase.from('user_settings').insert({
            id: crypto.randomUUID(),
            user_id: userId,
            security_policy: 'BALANCED'
          });
        }
      } catch (dbErr) {
        console.warn('[Auth] Database fallback to memory store:', dbErr.message);
      }
    }

    if (!savedToDb) {
      if (memoryUsers.has(email)) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }
      memoryUsers.set(email, { id: userId, email, password_hash: passwordHash });
    }

    const token = jwt.sign(
      { userId, email },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: userId, email }
    });
  } catch (err) {
    console.error('[Auth] Registration error:', err.message);
    return res.status(500).json({ success: false, message: 'Registration failed due to a server error.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const secret = process.env.JWT_SECRET || 'sentinel_default_secret_key_minimum_32_characters';

  try {
    const supabase = getSupabaseClient();
    let user = null;

    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (!error && data) {
          user = data;
        }
      } catch (dbErr) {
        console.warn('[Auth] DB query error, checking fallback:', dbErr.message);
      }
    }

    if (!user) {
      user = memoryUsers.get(email);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Authentication failed.' });
  }
}

export async function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  return res.json({
    success: true,
    user: { id: req.user.userId, email: req.user.email }
  });
}

