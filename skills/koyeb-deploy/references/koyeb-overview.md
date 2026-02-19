# Koyeb Deployment Methods

Koyeb offers two primary deployment methods for Next.js applications:

## 1. Git-Driven Deployment (Recommended)

The easiest way to deploy. Koyeb automatically builds and deploys when you push to your repository.

### Requirements:
- GitHub, GitLab, or Bitbucket repository
- Node.js application with `package.json`
- Koyeb account (free tier: 2 services forever)

### Key Features:
- Automatic builds on every push
- Native Next.js buildpack support
- No Dockerfile required
- Built-in CI/CD pipeline

### Environment Variables:
```
PORT=3000  # Koyeb automatically sets this
NODE_ENV=production
```

## 2. Docker Deployment

Deploy pre-built containers from any registry (GitHub Container Registry, Docker Hub, etc.)

### Requirements:
- Docker installed locally
- Dockerfile in your project
- Container registry access

### When to Use Docker:
- Custom build process needed
- Specific Node.js version required
- Additional system dependencies
- Multi-stage builds for optimization

## Comparison

| Feature | Git-Driven | Docker |
|---------|-----------|---------|
| Setup time | 2 minutes | 10 minutes |
| Build automation | ✅ Automatic | Manual push |
| Custom dependencies | Limited | Full control |
| Learning curve | Low | Medium |
| Best for | Most apps | Complex setups |

## Koyeb Platform Features

- **Global Edge Network**: Deploy to multiple regions
- **Auto-Scaling**: Scale based on traffic
- **Custom Domains**: Add your own domain with SSL
- **Environment Variables**: Secure config management
- **Health Checks**: Automatic restart on failure
- **Logs & Metrics**: Built-in monitoring

## Pricing

- **Free Tier**: 2 services forever (512MB RAM, 0.1 vCPU)
- **Starter**: $5/month per service
- **Professional**: $29/month per service (higher limits)
