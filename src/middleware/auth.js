const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Get token from header (support both formats) or cookies
  let token = req.header('x-auth-token') || req.header('Authorization') || req.cookies.token || req.cookies.accessToken;

  // Remove Bearer prefix if present
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({
      message: 'No token provided, authorization denied',
      code: 'NO_TOKEN'
    });
  }

  try {
    // FIX 1: Algorithm Enforcement - Explicitly require HS256 to prevent "none" and confusion attacks
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    // Verify user still exists and account is not locked
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'User not found, authorization denied',
        code: 'USER_NOT_FOUND'
      });
    }

    // FIX 2: Token Revocation - Check if token version matches (invalidates old tokens after password change)
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        message: 'Token is invalid (password changed or revoked)',
        code: 'TOKEN_REVOKED'
      });
    }

    // FIX 3: Contextual Binding - Verify fingerprint cookie matches the hash in the token
    if (decoded.fingerprintHash) {
      const fingerprintCookie = req.cookies.fingerprint;
      if (!fingerprintCookie) {
        return res.status(401).json({
          message: 'Session fingerprint missing',
          code: 'FINGERPRINT_MISSING'
        });
      }

      // Hash the fingerprint cookie and compare with the hash stored in the token
      const expectedHash = crypto.createHash('sha256').update(fingerprintCookie).digest('hex');
      if (expectedHash !== decoded.fingerprintHash) {
        return res.status(401).json({
          message: 'Session fingerprint mismatch',
          code: 'FINGERPRINT_MISMATCH'
        });
      }
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        message: 'Account is temporarily locked',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Add complete user info to request
    req.user = user;

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    res.status(401).json({
      message: 'Token verification failed',
      code: 'TOKEN_ERROR'
    });
  }
};