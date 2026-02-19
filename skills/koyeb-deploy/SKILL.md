---
name: koyeb-deploy
description: Deploy Next.js applications to Koyeb serverless platform. Use when the user needs to deploy a Next.js app, set up CI/CD for Next.js, configure custom domains, or troubleshoot deployment issues on Koyeb. Triggers include mentions of deploying to Koyeb, Next.js hosting, serverless deployment, or Docker deployment on Koyeb.
---

# Koyeb Deploy

Deploy Next.js applications to Koyeb's serverless platform with automatic scaling and global edge network.

## When to Use This Skill

Use this skill when:
- User wants to deploy a Next.js application
- User needs hosting for a React/Next.js project
- User asks about serverless deployment options
- User mentions Koyeb platform
- User needs Docker deployment help
- User wants to set up CI/CD for Next.js

## Core Capabilities

### 1. Git-Driven Deployment (Recommended)
Automatic deployment from Git repository on every push.

**Use when:**
- Standard Next.js app
- Want automatic deployments
- No special build requirements
- Fastest setup preferred

→ Read [Next.js Git Deployment](references/nextjs-git-deployment.md)

### 2. Docker Deployment
Deploy containerized Next.js with full environment control.

**Use when:**
- Custom Node.js version needed
- System dependencies required
- Multi-stage builds for optimization
- Need reproducible builds

→ Read [Next.js Docker Deployment](references/nextjs-docker-deployment.md)

### 3. Platform Overview
Understand Koyeb's features and pricing.

→ Read [Koyeb Overview](references/koyeb-overview.md)

## Deployment Workflow

### Step 1: Choose Deployment Method

**Ask the user:**
- Is this a standard Next.js app or does it have special requirements?
- Do you need automatic deployment on every git push?
- Are there custom system dependencies or specific Node.js version requirements?

**Decision Tree:**
```
Standard Next.js app?
  ├─ Yes → Git-Driven Deployment (faster)
  └─ No (custom deps, specific Node version)
      └─ Docker Deployment (more control)
```

### Step 2: Prepare the Application

**For Git Deployment:**
- Ensure `package.json` has `build` and `start` scripts
- Push code to GitHub/GitLab/Bitbucket
- Verify app runs locally with `npm run build && npm start`

**For Docker Deployment:**
- Create `Dockerfile` in project root
- Configure `next.config.js` with `output: 'standalone'`
- Test locally: `docker build -t test . && docker run -p 3000:3000 test`

### Step 3: Configure Koyeb Service

**Required settings:**
- Port: `3000` (or your Next.js port)
- Environment variables (if any)
- Instance size (start with free tier)

**Optional settings:**
- Custom domain
- Health check endpoint
- Auto-scaling rules

### Step 4: Deploy and Verify

- Click Deploy in Koyeb dashboard
- Monitor build logs
- Test the provided URL
- Verify all pages load correctly

## Common Configurations

### Environment Variables

**Essential:**
```
NODE_ENV=production
PORT=3000
```

**Common app-specific:**
```
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### Custom Domain Setup

1. Add domain in Koyeb Dashboard → Service → Domains
2. Copy DNS records provided
3. Add records to your DNS provider (Cloudflare, Namecheap, etc.)
4. Wait for SSL certificate provisioning (auto)

### Build Optimization

**Reduce build time:**
- Use `npm ci` instead of `npm install`
- Add `.koyebignore` for unnecessary files
- Cache dependencies between builds

**Reduce bundle size:**
- Enable Next.js image optimization
- Use dynamic imports for heavy components
- Analyze bundle with `@next/bundle-analyzer`

## Troubleshooting Guide

### Build Failures

**Symptom:** Build fails in Koyeb

**Check:**
1. Does `npm run build` work locally?
2. Is `package.json` in repository root?
3. Are all dependencies in `dependencies` (not `devDependencies`) if needed at runtime?

→ Read build logs in Koyeb dashboard

### Runtime Errors

**Symptom:** App builds but crashes or shows errors

**Check:**
1. Environment variables configured in Koyeb?
2. Port set correctly (default 3000)?
3. Check application logs in Koyeb

### Static Assets Not Loading

**Symptom:** 404 on images, CSS, or JS files

**Fix:**
```javascript
// next.config.js
module.exports = {
  assetPrefix: process.env.KOYEB_APP_URL || '',
}
```

### Slow Performance

**Symptoms:** Slow page loads

**Optimizations:**
- Enable Next.js static generation where possible
- Use Koyeb's global edge network
- Implement proper caching headers
- Optimize images with Next.js Image component

## Best Practices

### Security
- Store secrets in Koyeb environment variables (not in code)
- Use `NEXT_PUBLIC_` prefix only for non-sensitive client-side vars
- Enable HTTPS (auto-enabled on Koyeb)

### Performance
- Use Next.js Image component for optimization
- Enable Incremental Static Regeneration (ISR) for dynamic content
- Implement proper `Cache-Control` headers
- Use middleware for edge-level redirects

### CI/CD
- Connect GitHub repository for auto-deploy
- Use preview deployments for pull requests
- Set up branch-based environments (dev/staging/prod)

## Koyeb CLI (Optional)

Install Koyeb CLI for terminal-based deployment:

```bash
# macOS
brew install koyeb/tap/koyeb

# Linux
curl -fsSL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | bash

# Login
koyeb login

# Deploy
koyeb service create nextjs-app \
  --git github.com/username/repo \
  --git-branch main \
  --ports 3000:http \
  --env PORT=3000
```

## Pricing & Limits

**Free Tier:**
- 2 services forever
- 512MB RAM per service
- 0.1 vCPU per service
- 100GB bandwidth/month
- Community support

**Paid Tiers:**
- Starter: $5/month per service
- Professional: $29/month per service
- Higher resource limits
- Priority support

## Useful Links

- [Koyeb Dashboard](https://app.koyeb.com)
- [Koyeb Next.js Docs](https://www.koyeb.com/docs/deploy/nextjs)
- [Example Next.js Repo](https://github.com/koyeb/example-nextjs)
- [Koyeb Status](https://status.koyeb.com)

## Output Format

When helping with deployment, provide:
1. **Deployment method recommendation** (Git vs Docker)
2. **Step-by-step instructions** tailored to their app
3. **Required configuration** (env vars, build settings)
4. **Troubleshooting tips** specific to their setup
5. **Next steps** (custom domain, monitoring, etc.)

Always include the Koyeb dashboard URL and relevant documentation links.
