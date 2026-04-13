# HornbillSentinel - Digital Type Security Assessment

## Overview
A full-stack web application for security-focused "Digital Type" personality assessment. Helps users understand their cybersecurity behaviors and vulnerabilities.

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React (Create React App)
- **Security:** Helmet CSP, CSRF protection, rate limiting, input sanitization, 2FA (TOTP + Email OTP), Argon2id password hashing

## Repository Layout
```
├── src/                 # Express API, middleware, models, utils
├── frontend/            # React application
│   ├── src/pages/       # Route-level domains (auth, assessment)
│   ├── src/components/  # Shared UI and layout elements
│   ├── src/hooks/       # Custom React hooks (e.g. usePasswordValidation)
│   └── src/context/     # Context providers
├── tests/               # Backend security tests
├── scripts/             # Utility scripts
└── .env.example         # Environment variable template
```

## Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)
- Gmail account with App Password (for email features)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/matrixwork1/HornbillSentinel.git
cd HornbillSentinel
```

### 2. Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

### 3. Configure Environment
```bash
# Copy template and edit with your values
cp .env.example .env
```

**Required variables:**
- `JWT_SECRET` - Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `SESSION_SECRET` - Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `MONGO_URI` - MongoDB connection string
- `GMAIL_USER` + `GMAIL_APP_PASSWORD` - For email OTP features

### 4. Start the Application
```bash
# Terminal 1: Backend (port 5001)
npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend && npm start
```

Open http://localhost:3000 in your browser.

## Security Features

| Feature | Implementation |
|---------|----------------|
| Password Hashing | Argon2id with secure parameters |
| JWT Tokens | HS256 algorithm enforcement, fingerprint binding |
| Token Revocation | Version-based invalidation on password change |
| CSRF Protection | Session-based tokens |
| Rate Limiting | Per-endpoint limits (login, reset, assessment) |
| Input Validation | Zod schemas + mongo-sanitize |
| 2FA | TOTP, backup codes, email OTP fallback |
| Headers | Helmet CSP with nonces, HSTS preload |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create account
- `POST /login` - Login (may require 2FA)
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout
- `POST /forgot-password` - Request password reset
- `GET /me` - Current user info

### Two-Factor (`/api/two-factor`)
- `POST /setup` - Begin TOTP setup
- `POST /verify` - Verify 2FA during login
- `POST /disable` - Disable 2FA
- `GET /status` - 2FA status

### Assessment (`/api/assessment`)
- `GET /questions` - Question bank
- `POST /next` - Adaptive next question
- `POST /submit` - Submit assessment (auth required)
- `POST /submit-guest` - Guest assessment
- `GET /results` - Latest results
- `GET /history` - Assessment history

## Development

### Backend
```bash
npm run dev      # Development with nodemon
npm start        # Production
```

### Frontend
```bash
cd frontend
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | JWT signing key (64+ bytes) | ✅ |
| `SESSION_SECRET` | Session cookie secret | ✅ |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `GMAIL_USER` | Gmail address for OTP | ✅ |
| `GMAIL_APP_PASSWORD` | Gmail App Password | ✅ |
| `PORT` | API port (default: 5001) | ❌ |
| `FRONTEND_URL` | Frontend origin for CORS | Production |

## Troubleshooting

- **MongoDB errors:** Verify `MONGO_URI` and ensure MongoDB is running
- **CSRF errors:** Frontend must fetch `/api/csrf-token` first
- **CORS blocked:** Set `FRONTEND_URL` in production
- **2FA issues:** Ensure device time is synchronized for TOTP

## License
ISC

## Contributors
- Hornbill Sentinel Team
