# Docker — HornbillSentinel

## Prerequisites

1. Copy `.env.example` to `.env` and fill in all required values:

   ```bash
   cp .env.example .env
   ```

   At minimum you must set `JWT_SECRET`, `SESSION_SECRET`, and your Gmail credentials.

## Running Locally with Docker Compose

```bash
# Build and start the backend + MongoDB
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

The API will be available at **http://localhost:5001**.  
Health check: **http://localhost:5001/api/health**

## Stopping

```bash
docker compose down          # stop containers (data persists in the mongo-data volume)
docker compose down -v       # stop containers AND delete the database volume
```

## Building a Standalone Image

```bash
docker build -t hornbill-sentinel .

# For a different target architecture (e.g. deploying from Mac M1 to amd64 cloud)
docker build --platform=linux/amd64 -t hornbill-sentinel .
```

Then push to your registry:

```bash
docker push myregistry.com/hornbill-sentinel
```

## References

- [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
- [Compose file reference](https://docs.docker.com/go/compose-spec-reference/)