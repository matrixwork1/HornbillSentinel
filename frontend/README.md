# HornbillSentinel — Frontend

React-based frontend for the Digital Type Security Assessment application.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server (port 3000)
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5001` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |

## Production Build

```bash
npm run build
```

Output is in the `build/` directory, ready for static hosting (e.g. Vercel, Netlify).
