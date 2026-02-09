const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { sendResetEmail, sendOTPEmail } = require('../utils/email');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const xss = require('xss');
// Import validation middleware
const { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validation');

// Helper function to set secure cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Helper function to clear cookie
const clearTokenCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

// Helper functions for token generation and cookie management
const generateAccessToken = (user, fingerprintHash = null) => {
  const payload = {
    id: user._id,
    email: user.email,
    tokenVersion: user.tokenVersion || 0
  };

  // FIX 3: Include fingerprint hash for contextual binding (sidejacking prevention)
  if (fingerprintHash) {
    payload.fingerprintHash = fingerprintHash;
  }

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m', algorithm: 'HS256' }
  );
};

const generateRefreshToken = async (user, ipAddress) => {
  const refreshToken = RefreshToken.generateToken();

  const newRefreshToken = new RefreshToken({
    token: refreshToken,
    userId: user._id,
    createdByIp: ipAddress,
    tokenVersion: user.tokenVersion || 0
  });

  await newRefreshToken.save();
  return refreshToken;
};

// Helper function to set auth cookies
const setAuthCookies = (res, accessToken, refreshToken, fingerprint = null) => {
  // Set access token cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  // Set both token and accessToken for compatibility
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // FIX 3: Set fingerprint cookie for contextual binding (sidejacking prevention)
  if (fingerprint) {
    res.cookie('fingerprint', fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes (same as access token)
    });
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  // FIX 3: Clear fingerprint cookie on logout
  res.clearCookie('fingerprint', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

// Register a new user - using Zod validation
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    // Use firstName as the full name
    const name = firstName;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        tokenVersion: user.tokenVersion || 0
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m', algorithm: 'HS256' }
    );

    // Set secure cookie
    setTokenCookie(res, token);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user - using Zod validation
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Check if it matches the previous password
      const isPreviousPassword = await user.compareWithPreviousPassword(password);

      if (isPreviousPassword) {
        const passwordChangedDate = user.passwordChangedAt ? user.passwordChangedAt.toISOString() : null;
        return res.status(400).json({
          message: 'Invalid credentials',
          isOldPassword: true,
          passwordChangedAt: passwordChangedDate
        });
      }

      // Increment login attempts for wrong password
      await user.incLoginAttempts();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Return partial authentication - don't set cookies yet
      return res.json({
        requiresTwoFactor: true,
        userId: user._id,
        message: 'Please complete two-factor authentication'
      });
    }

    // Generate tokens (only if 2FA is not required)
    // FIX 3: Generate fingerprint for contextual binding
    const fingerprint = crypto.randomBytes(32).toString('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    const accessToken = generateAccessToken(user, fingerprintHash);
    const refreshToken = await generateRefreshToken(user, ipAddress);

    // Set secure cookies (including fingerprint)
    setAuthCookies(res, accessToken, refreshToken, fingerprint);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        digitalType: user.digitalType
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Request password reset with OTP - using Zod validation
router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return success message for security
    if (!user) {
      return res.json({
        message: 'If an account with that email exists, a verification code has been sent.',
        success: true
      });
    }

    // Generate and save OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, otp, user.name);

    res.json({
      message: 'If an account with that email exists, a verification code has been sent.',
      success: true
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error processing password reset request' });
  }
});

// Reset password with token - using Zod validation
router.post('/reset-password-with-token', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validate password strength explicitly
    const { validatePasswordStrength } = require('../utils/passwordUtils');
    const { isValid, errors } = validatePasswordStrength(password);
    if (!isValid) {
      return res.status(400).json({
        message: errors[0]
      });
    }

    // Hash the token for comparison
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const sameAsCurrent = await user.comparePassword(password);
    const sameAsPrevious = await user.compareWithPreviousPassword(password);
    if (sameAsCurrent || sameAsPrevious) {
      return res.status(400).json({ message: 'New password cannot be the same as your current or previous password' });
    }

    // Store previous password hash for old password detection
    user.previousPasswordHash = user.password;

    // Update password and clear reset token
    user.password = password;
    user.passwordChangedAt = Date.now();
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Update password (for logged-in users) - with session invalidation
router.put('/reset-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Get user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const sameAsCurrent = await user.comparePassword(newPassword);
    const sameAsPrevious = await user.compareWithPreviousPassword(newPassword);
    if (sameAsCurrent || sameAsPrevious) {
      return res.status(400).json({ message: 'New password cannot be the same as your current or previous password' });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    // Invalidate current session by clearing cookie and requiring re-login
    clearTokenCookie(res);

    res.json({
      message: 'Password updated successfully. Please log in again.',
      requireReauth: true
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error during password update' });
  }
});

// Get current user (for checking authentication status)
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        digitalType: req.user.digitalType
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: 'No refresh token provided',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    // Find and validate refresh token
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!storedToken) {
      return res.status(401).json({
        message: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    const user = storedToken.userId;
    if (!user || user.isLocked) {
      return res.status(401).json({
        message: 'User not found or account locked',
        code: 'USER_INVALID'
      });
    }

    // Generate new fingerprint for contextual binding
    const fingerprint = crypto.randomBytes(32).toString('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    // Generate new access token with fingerprint
    const newAccessToken = generateAccessToken(user, fingerprintHash);

    // Set new access token cookies (both formats for compatibility)
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Also set the 'token' cookie to ensure compatibility
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set fingerprint cookie for contextual binding
    res.cookie('fingerprint', fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({
      message: 'Token refreshed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        digitalType: user.digitalType
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});

// Add this logout route before the module.exports
router.post('/logout', auth, async (req, res) => {
  try {
    // Get the refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    // If refresh token exists, invalidate it in the database
    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    // Clear all authentication cookies
    clearAuthCookies(res);

    // Also clear the legacy token cookie for compatibility
    clearTokenCookie(res);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, clear the cookies
    clearAuthCookies(res);
    clearTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
  }
});

// Verify OTP for password reset
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    const otpResult = user.verifyOTP(otp);
    if (!otpResult.valid) {
      await user.save(); // Save updated attempt count
      return res.status(400).json({ message: otpResult.message });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();

    // Clear OTP and save user
    user.clearOTP();
    await user.save();

    res.json({
      message: 'OTP verified successfully',
      resetToken: resetToken, // Send the plain token to frontend
      success: true
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Export helper functions
module.exports = {
  router,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies
};
