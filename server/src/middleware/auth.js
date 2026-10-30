// server/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const secret = process.env.JWT_SECRET || 'sentinel_default_secret_key_minimum_32_characters';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session token has expired. Please log in again.' });
    }
    return res.status(403).json({ success: false, message: 'Invalid authentication token.' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const secret = process.env.JWT_SECRET || 'sentinel_default_secret_key_minimum_32_characters';
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
    } catch (_) {
      // Optional auth: continue as guest if invalid
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}

