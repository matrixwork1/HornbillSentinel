require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const enhancedSanitize = require('./middleware/sanitize');
const { generateNonce } = require('./middleware/csp');
const { router: authRoutes } = require('./routes/auth');
const twoFactorRoutes = require('./routes/twoFactor');
const assessmentRoutes = require('./routes/assessment');
const { verifyTransporter, sendTestEmail } = require('./utils/email');
const { csrfProtection, getCSRFToken } = require('./middleware/csrf');

const app = express();

// Trust proxy (required for Cloud Run / reverse proxies)
// This ensures secure cookies work behind Cloud Run's load balancer
app.set('trust proxy', 1);

// HTTPS enforcement middleware (for production)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});

// Generate CSP nonce for each request
app.use(generateNonce);

// Enhanced security middleware with modern CSP and improved HSTS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://cdnjs.cloudflare.com", (req, res) => `'nonce-${res.locals.nonce}'`],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"], // Updated to 'none' for better security
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    },
  },
  hsts: {
    maxAge: 63072000, // 2 years
    includeSubDomains: true,
    preload: true // Enhanced HSTS with preload
  },
  noSniff: true,
  // Removed xssFilter (X-XSS-Protection) as it's obsolete and can cause issues
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: false, // Disable if causing issues with external resources
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Cookie parser middleware
app.use(cookieParser());

// Session middleware for CSRF (fallback to in-memory store in development)
const baseSessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
};
if (process.env.NODE_ENV === 'production') {
  baseSessionConfig.store = MongoStore.create({ mongoUrl: process.env.MONGO_URI });
}
app.use(session(baseSessionConfig));

// MongoDB sanitization - ADD THIS SECTION
app.use(mongoSanitize({
  replaceWith: '_', // Replace prohibited characters with underscore
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key: ${key} in request from IP: ${req.ip}`);
  }
}));

// Enhanced sanitization (ADD THIS LINE)
app.use(enhancedSanitize);

const isAuthenticatedRequest = (req) => {
  let token = req.header('x-auth-token') || req.header('Authorization') || req.cookies.token || req.cookies.accessToken;
  if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => ipKeyGenerator(req.ip || req.connection.remoteAddress),
  skip: (req) => req.method === 'OPTIONS'
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => ipKeyGenerator(req.ip || req.connection.remoteAddress),
  skip: (req) => req.method === 'OPTIONS'
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 300 : 1000,
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => ipKeyGenerator(req.ip || req.connection.remoteAddress),
  skip: (req) => req.method === 'OPTIONS' || isAuthenticatedRequest(req)
});

const assessmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 500 : 2000,
  message: {
    error: 'Too many assessment requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => ipKeyGenerator(req.ip || req.connection.remoteAddress),
  skip: (req) => req.method === 'OPTIONS' || isAuthenticatedRequest(req)
});

// Apply specific rate limiting
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);
app.use('/api/auth/reset-password', passwordResetLimiter);
app.use('/api/auth/forgot-password', passwordResetLimiter);
app.use('/api/assessment', assessmentLimiter);
app.use(generalLimiter);

// CORS configuration
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(url => url.trim());

const corsOptions = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    // Allow requests with no origin (e.g. mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // Check exact match against allowed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow Vercel preview deployment URLs (pattern: *-<project>.vercel.app)
    // Only allow Vercel preview deployments for this specific project
    if (/^https:\/\/[a-z0-9-]+-hornbillsentinel[a-z0-9-]*\.vercel\.app$/.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Get CSRF token endpoint (no protection needed)
app.get('/api/csrf-token', getCSRFToken);

// Apply CSRF protection to auth routes except refresh
if (process.env.NODE_ENV !== 'test') {
  // Apply CSRF protection to auth routes (excluding refresh)
  app.use('/api/auth', (req, res, next) => {
    if (req.path === '/refresh') {
      return next();
    }
    return csrfProtection(req, res, next);
  });
  app.use('/api/assessment', csrfProtection);
  // Apply CSRF protection to all two-factor routes
  app.use('/api/two-factor', csrfProtection);
}

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGO_URI || process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/digital_type_assessment';
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/two-factor', twoFactorRoutes);
app.use('/api/assessment', assessmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Email transporter verification (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/email/verify', async (req, res) => {
    const result = await verifyTransporter();
    if (result.ok) return res.json({ ok: true });
    return res.status(500).json({ ok: false, error: result.error });
  });
  app.post('/api/email/test', async (req, res) => {
    try {
      const to = req.body?.to || process.env.GMAIL_USER;
      await sendTestEmail(to);
      res.json({ ok: true, to });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
}
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
