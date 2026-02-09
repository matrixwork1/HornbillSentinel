const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Keep for backward compatibility
const argon2 = require('argon2');
const crypto = require('crypto'); // Add this line

// Add this to the UserSchema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [12, 'Password must be at least 12 characters long']
  },
  digitalType: {
    type: String,
    enum: [
      'Careless Clicker',
      'Password Reuser',
      'Update Avoider',
      'Oversharer',
      'Security Savvy',
      'The Strategic Custodian',
      'The Technical Architect',
      'The Network Liaison',
      'The Operational Analyst',
      'The Digital Consumer'
    ],
    default: null
  },
  // Account lockout fields
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  // Password reset fields
  resetToken: String,
  resetTokenExpiry: Date,
  // Add OTP fields
  otpCode: String,
  otpExpiry: Date,
  otpAttempts: {
    type: Number,
    default: 0
  },
  // 2FA fields
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    default: null
  },
  twoFactorBackupCodes: [{
    code: {
      type: String,
      required: true
    },
    used: {
      type: Boolean,
      default: false
    },
    usedAt: Date
  }],
  trustedDevices: [{
    deviceId: {
      type: String,
      required: true
    },
    deviceName: String,
    userAgent: String,
    ipAddress: String,
    addedAt: {
      type: Date,
      default: Date.now
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }],
  // Email OTP for fallback
  emailOtpCode: String,
  emailOtpExpiry: Date,
  emailOtpAttempts: {
    type: Number,
    default: 0
  },
  emailOTP: {
    type: String,
    default: undefined
  },
  emailOTPExpiry: {
    type: Date,
    default: undefined
  },
  emailOTPAttempts: {
    type: Number,
    default: 0
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  // Password tracking fields
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  // Store previous password hash for old password detection
  previousPasswordHash: String,
  // Token versioning for security
  tokenVersion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Constants for account lockout
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
const LOCK_TIME = parseInt(process.env.LOCK_TIME) || 2 * 60 * 60 * 1000; // 2 hours

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // Store previous password hash if password is being changed (not on creation)
    if (!this.isNew && this.password) {
      // Get the current password hash from database before it's overwritten
      const currentUser = await this.constructor.findById(this._id);
      if (currentUser && currentUser.password) {
        this.previousPasswordHash = currentUser.password;
      }
    }

    // Use Argon2id for password hashing
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MiB
      timeCost: 3,       // 3 iterations
      parallelism: 1     // 1 degree of parallelism
    });

    // Update password changed date
    this.passwordChangedAt = new Date();

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords - supports both argon2 and bcrypt for backward compatibility
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Check if the hash is Argon2 (starts with $argon2)
    if (this.password.startsWith('$argon2')) {
      return await argon2.verify(this.password, candidatePassword);
    }
    // Fallback to bcrypt for backward compatibility
    else {
      return await bcrypt.compare(candidatePassword, this.password);
    }
  } catch (error) {
    throw error;
  }
};

// Method to check if provided password matches previous password
UserSchema.methods.compareWithPreviousPassword = async function (candidatePassword) {
  if (!this.previousPasswordHash) return false;
  try {
    // Check if the hash is Argon2 (starts with $argon2)
    if (this.previousPasswordHash.startsWith('$argon2')) {
      return await argon2.verify(this.previousPasswordHash, candidatePassword);
    }
    // Fallback to bcrypt for backward compatibility
    else {
      return await bcrypt.compare(candidatePassword, this.previousPasswordHash);
    }
  } catch (error) {
    return false;
  }
};

// Method to handle failed login attempts
UserSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + LOCK_TIME
    };
  }

  return this.updateOne(updates);
};

// Method to update last login
UserSchema.methods.updateLastLogin = function () {
  return this.updateOne({ lastLogin: new Date() });
};

// Method to generate OTP
UserSchema.methods.generateOTP = function () {
  const otp = crypto.randomInt(100000, 1000000).toString(); // 6-digit cryptographically secure OTP
  this.otpCode = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  this.otpAttempts = 0;
  return otp;
};

// Method to verify OTP
UserSchema.methods.verifyOTP = function (inputOTP) {
  if (!this.otpCode || !this.otpExpiry) {
    return { valid: false, message: 'No OTP found' };
  }

  if (Date.now() > this.otpExpiry) {
    return { valid: false, message: 'OTP has expired' };
  }

  if (this.otpAttempts >= 3) {
    return { valid: false, message: 'Too many OTP attempts' };
  }

  if (this.otpCode !== inputOTP) {
    this.otpAttempts += 1;
    return { valid: false, message: 'Invalid OTP' };
  }

  return { valid: true, message: 'OTP verified successfully' };
};

// Method to clear OTP
UserSchema.methods.clearOTP = function () {
  this.otpCode = undefined;
  this.otpExpiry = undefined;
  this.otpAttempts = 0;
};

// Add the missing generateResetToken method
UserSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token before storing in database
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Return the plain token (not hashed) to send to user
  return resetToken;
};

// Method to check if password was recently changed
UserSchema.methods.wasPasswordRecentlyChanged = function () {
  if (!this.passwordChangedAt) return false;
  const daysSinceChange = Math.floor((Date.now() - this.passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceChange <= 30; // Consider "recent" if changed within 30 days
};

// Method to check if provided password matches previous password
UserSchema.methods.compareWithPreviousPassword = async function (candidatePassword) {
  if (!this.previousPasswordHash) return false;
  try {
    // Check if the hash is Argon2 (starts with $argon2)
    if (this.previousPasswordHash.startsWith('$argon2')) {
      return await argon2.verify(this.previousPasswordHash, candidatePassword);
    }
    // Fallback to bcrypt for backward compatibility
    else {
      return await bcrypt.compare(candidatePassword, this.previousPasswordHash);
    }
  } catch (error) {
    return false;
  }
};

// Index for better query performance
UserSchema.index({ resetToken: 1 });
UserSchema.index({ lockUntil: 1 });

// Add this method to UserSchema.methods
UserSchema.methods.incrementTokenVersion = async function () {
  this.tokenVersion += 1;
  await this.save();
  return this.tokenVersion;
};

module.exports = mongoose.model('User', UserSchema);
