# Next.js Docker Deployment on Koyeb

Use Docker for full control over your build environment and dependencies.

## When to Use Docker

- Custom Node.js version required
- System dependencies (e.g., image processing libraries)
- Multi-stage builds for smaller images
- Complex build processes
- Reproducible builds across environments

## Prerequisites

1. Docker installed locally
2. GitHub account with GitHub Container Registry (ghcr.io)
3. Koyeb account
4. Docker configured for GitHub Packages

## Step-by-Step Docker Deployment

### 1. Create Dockerfile

Create a `Dockerfile` in your Next.js project root:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Configure Next.js for Standalone Output

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

This creates a minimal server bundle in `.next/standalone`.

### 3. Build Docker Image

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Build the image
docker build -t ghcr.io/YOUR_USERNAME/nextjs-app:latest .

# Push to registry
docker push ghcr.io/YOUR_USERNAME/nextjs-app:latest
```

### 4. Deploy to Koyeb

1. Koyeb Dashboard → **Create Service**
2. Select **"Docker"** tab
3. Image URL: `ghcr.io/YOUR_USERNAME/nextjs-app:latest`
4. Port: `3000`
5. Click **Deploy**

## Multi-Stage Build Optimization

The Dockerfile above uses multi-stage builds for efficiency:

| Stage | Purpose | Size Impact |
|-------|---------|-------------|
| deps | Install production dependencies | Cached layer |
| builder | Build Next.js application | Discarded |
| runner | Final minimal image | ~100MB |

## Environment Variables in Docker

### Build-time (ARG):
```dockerfile
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
```

### Run-time (ENV):
Set these in Koyeb Dashboard:
```
NODE_ENV=production
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
```

## Docker Compose (Local Testing)

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

```bash
docker-compose up
```

## Automated Docker Builds with GitHub Actions

Create `.github/workflows/docker.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and Push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```

## Registry Options

| Registry | Image URL Format | Private Support |
|----------|------------------|-----------------|
| GitHub Container Registry | `ghcr.io/user/repo:tag` | ✅ |
| Docker Hub | `username/repo:tag` | ✅ (paid) |
| GitLab Registry | `registry.gitlab.com/...` | ✅ |
| AWS ECR | `*.amazonaws.com/repo` | ✅ |

## Troubleshooting Docker Deployments

### Image Pull Failed
- Verify image URL is correct
- Check registry authentication
- Ensure image is public or credentials configured

### Container Exits Immediately
- Check `CMD` in Dockerfile
- Verify `PORT` environment variable
- Review container logs in Koyeb

### Large Image Size
- Use `node:alpine` base image
- Enable Next.js standalone output
- Multi-stage builds to exclude dev dependencies

### Build Takes Too Long
- Use `.dockerignore` to exclude unnecessary files:
```
node_modules
.next
.git
.env
```
