const express = require('express');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const { validate, twoFactorTokenSchema, twoFactorSetupSchema, twoFactorBackupSchema, twoFactorDisableSchema } = require('../middleware/validation');
const { generateAccessToken, generateRefreshToken, setAuthCookies } = require('./auth');
const TOTPUtils = require('../utils/totpUtils');
const EmailOTPUtils = require('../utils/emailOtpUtils');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for 2FA operations
const twoFactorLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many 2FA attempts, please try again later' }
});

// Setup 2FA - Generate secret and QR code
router.post('/setup', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Generate TOTP secret
    const secretData = TOTPUtils.generateSecret(user.email);
    const qrCodeDataURL = await TOTPUtils.generateQRCode(secretData.otpauthUrl);

    // Store secret temporarily (not enabled until verified)
    user.twoFactorSecret = secretData.secret;
    await user.save();

    res.json({
      secret: secretData.secret,
      qrCode: qrCodeDataURL,
      manualEntryKey: secretData.secret
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// Verify and enable 2FA
router.post('/verify-setup', authenticateToken, twoFactorLimit, validate(twoFactorSetupSchema), async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: 'No 2FA setup in progress' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Verify the token
    const isValid = TOTPUtils.verifyToken(token, user.twoFactorSecret);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Generate backup codes
    const backupCodes = TOTPUtils.generateBackupCodes();
    user.twoFactorBackupCodes = backupCodes.map(code => ({ code }));
    user.twoFactorEnabled = true;
    await user.save();

    res.json({
      message: '2FA enabled successfully',
      backupCodes: backupCodes
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Verify 2FA during login
router.post('/verify', twoFactorLimit, async (req, res) => {
  try {

    const { userId, token, method } = req.body;

    // Basic validation - check if all required fields are present
    if (!userId || !token || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Custom validation for different methods
    if (method === 'backup') {
      if (token.length < 8 || token.length > 12) {
        return res.status(400).json({ error: 'Invalid backup code format' });
      }
    } else if (method === 'email') {
      // Clean and validate the token for email OTP
      const cleanToken = token.toString().trim();

      if (!/^\d{6}$/.test(cleanToken)) {
        return res.status(400).json({ error: 'Email OTP must be exactly 6 digits' });
      }

      // Update the token in the request body
      req.body.token = cleanToken;
    } else if (method === 'totp') {
      // Use standard validation for TOTP
      const validation = twoFactorTokenSchema.safeParse(req.body);
      if (!validation.success) {
        console.log('TOTP validation failed:', validation.error.errors);
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.error.errors
        });
      }
    } else {
      return res.status(400).json({ error: 'Invalid verification method' });
    }

    const user = await User.findById(userId);
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    let isValid = false;

    if (method === 'email') {
      // Email OTP verification
      // Remove these debug lines:
      // console.log('Before user lookup - userId:', userId);
      // const freshUser = await User.findById(userId);
      // console.log('Fresh user emailOTP:', freshUser ? freshUser.emailOTP : 'No user');
      // console.log('Fresh user emailOTPExpiry:', freshUser ? freshUser.emailOTPExpiry : 'No user');

      if (user.emailOTP && user.emailOTPExpiry > new Date()) {
        const hashedInputOTP = EmailOTPUtils.hashOTP(token);
        // Remove these debug lines:
        // console.log('Email OTP Debug:');
        // console.log('- Input token:', token);
        // console.log('- Hashed input:', hashedInputOTP);
        // console.log('- Stored hash:', user.emailOTP);
        // console.log('- Expiry:', user.emailOTPExpiry);
        // console.log('- Current time:', new Date());

        if (hashedInputOTP === user.emailOTP) {
          isValid = true;
          user.emailOTP = undefined;
          user.emailOTPExpiry = undefined;
          user.emailOTPAttempts = 0;
        } else {
          user.emailOTPAttempts = (user.emailOTPAttempts || 0) + 1;
          if (user.emailOTPAttempts >= 3) {
            user.emailOTP = undefined;
            user.emailOTPExpiry = undefined;
            user.emailOTPAttempts = 0;
          }
        }
      }
    } else if (method === 'backup') {
      // Verify backup code using timing-safe comparison
      const backupCode = user.twoFactorBackupCodes.find(
        code => {
          if (code.used) return false;
          try {
            return crypto.timingSafeEqual(
              Buffer.from(code.code, 'utf8'),
              Buffer.from(token.padEnd(code.code.length), 'utf8').subarray(0, Buffer.byteLength(code.code, 'utf8'))
            ) && code.code.length === token.length;
          } catch {
            return false;
          }
        }
      );
      if (backupCode) {
        backupCode.used = true;
        backupCode.usedAt = new Date();
        isValid = true;
      }
    } else {
      // Verify TOTP (default)
      isValid = TOTPUtils.verifyToken(token, user.twoFactorSecret);
    }

    await user.save();

    if (isValid) {
      // Complete the login process with fingerprint for sidejacking protection
      const fingerprint = crypto.randomBytes(32).toString('hex');
      const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

      const accessToken = generateAccessToken(user, fingerprintHash);
      const refreshToken = await generateRefreshToken(user, ipAddress);

      setAuthCookies(res, accessToken, refreshToken, fingerprint);

      res.json({
        success: true,
        message: '2FA verification successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          digitalType: user.digitalType
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Use backup code
router.post('/backup-code', authenticateToken, validate(twoFactorBackupSchema), async (req, res) => {
  try {
    const { userId, token, useBackupCode, useEmailOTP } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    let isValid = false;

    if (useEmailOTP) {
      // Verify email OTP
      isValid = EmailOTPUtils.verifyOTP(token, user.emailOtpCode, user.emailOtpExpiry);
      if (isValid) {
        user.emailOtpCode = undefined;
        user.emailOtpExpiry = undefined;
        user.emailOtpAttempts = 0;
      } else {
        user.emailOtpAttempts = (user.emailOtpAttempts || 0) + 1;
      }
    } else if (useBackupCode) {
      // Verify backup code using timing-safe comparison
      const backupCode = user.twoFactorBackupCodes.find(
        code => {
          if (code.used) return false;
          try {
            return crypto.timingSafeEqual(
              Buffer.from(code.code, 'utf8'),
              Buffer.from(token.padEnd(code.code.length), 'utf8').subarray(0, Buffer.byteLength(code.code, 'utf8'))
            ) && code.code.length === token.length;
          } catch {
            return false;
          }
        }
      );
      if (backupCode) {
        backupCode.used = true;
        backupCode.usedAt = new Date();
        isValid = true;
      }
    } else {
      // Verify TOTP
      isValid = TOTPUtils.verifyToken(token, user.twoFactorSecret);
    }

    await user.save();

    if (isValid) {
      res.json({ success: true, message: '2FA verification successful' });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Send email OTP as fallback
router.post('/send-email-otp', twoFactorLimit, async (req, res) => {
  try {
    // Remove this debug line:
    // console.log('Send Email OTP Request:', JSON.stringify(req.body, null, 2));
    const { userId } = req.body;
    const user = await User.findById(userId);
    // Remove these debug lines:
    // console.log('User found:', !!user, 'User ID:', userId);
    // console.log('User 2FA enabled:', user ? user.twoFactorEnabled : 'No user');

    if (!user || !user.twoFactorEnabled) {
      // Return generic success to prevent user enumeration
      return res.json({ message: 'If 2FA is enabled, an email OTP has been sent' });
    }

    // Generate and send email OTP
    const otp = EmailOTPUtils.generateOTP();
    // Remove this debug line:
    // console.log('Generated OTP:', otp);
    user.emailOTP = EmailOTPUtils.hashOTP(otp);
    user.emailOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.emailOTPAttempts = 0;
    // Remove these debug lines:
    // console.log('Before save - emailOTP:', user.emailOTP);
    // console.log('Before save - emailOTPExpiry:', user.emailOTPExpiry);
    await user.save();
    // Remove this debug line:
    // console.log('User saved successfully');

    // Send OTP email
    const success = await EmailOTPUtils.sendOTPEmail(user.email, otp, 'login');
    // Remove this debug line:
    // console.log('Email send result:', success);

    if (!success) {
      // Remove this debug line:
      // console.log('Failed to send email');
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Remove this debug line:
    // console.log('Email OTP sent successfully');
    res.json({ message: 'Email OTP sent successfully' });
  } catch (error) {
    console.error('Email OTP error:', error);
    res.status(500).json({ error: 'Failed to send email OTP' });
  }
});

// Disable 2FA
router.post('/disable', authenticateToken, validate(twoFactorDisableSchema), async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to disable 2FA' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorBackupCodes = [];
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// Get 2FA status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const unusedBackupCodes = user.twoFactorBackupCodes.filter(code => !code.used).length;

    res.json({
      twoFactorEnabled: user.twoFactorEnabled,
      backupCodesRemaining: unusedBackupCodes
    });
  } catch (error) {
    console.error('2FA status error:', error);
    res.status(500).json({ error: 'Failed to get 2FA status' });
  }
});

module.exports = router;