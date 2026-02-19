# Next.js Git-Driven Deployment on Koyeb

This is the fastest way to deploy Next.js apps on Koyeb.

## Prerequisites

1. **Koyeb Account**: Sign up at https://app.koyeb.com
2. **Git Repository**: Push your Next.js code to GitHub/GitLab/Bitbucket
3. **Next.js App**: Standard Next.js project with `package.json`

## Step-by-Step Deployment

### 1. Prepare Your Next.js App

Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

For static export (optional):
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

And in `next.config.js`:
```javascript
module.exports = {
  output: 'export',  // For static sites
  distDir: 'dist',
}
```

### 2. Connect Git Repository

1. Log in to Koyeb Dashboard: https://app.koyeb.com
2. Click **"Create Service"**
3. Select **"GitHub"** (or GitLab/Bitbucket)
4. Connect your GitHub account
5. Select your Next.js repository
6. Choose branch (usually `main` or `master`)

### 3. Configure Build Settings

Koyeb auto-detects Next.js, but verify these settings:

- **Builder**: Buildpack (auto-detected)
- **Build Command**: `npm install && npm run build`
- **Run Command**: `npm start`
- **Port**: `3000` (Next.js default)

### 4. Set Environment Variables

Add these if needed:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 5. Deploy

Click **"Deploy"**. Koyeb will:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Build the app (`npm run build`)
4. Start the server (`npm start`)
5. Provide a URL like `https://your-app-your-org.koyeb.app`

## One-Click Deploy Button

Add this to your README.md for instant deployment:

```markdown
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&builder=buildpack&repository=github.com/YOUR_USERNAME/YOUR_REPO&branch=main&name=your-app&env[PORT]=3000&ports=3000;http;/)
```

## Auto-Deployment on Push

Once connected, Koyeb automatically:
- Detects pushes to your configured branch
- Builds the new version
- Deploys with zero-downtime
- Rolls back on build failure

## Custom Domain Setup

1. In Koyeb Dashboard → Your Service → Domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `www.yoursite.com`)
4. Add the provided DNS records to your domain registrar
5. SSL certificate auto-provisioned

## Troubleshooting

### Build Fails
- Check `package.json` scripts exist
- Verify Node.js version compatibility
- Check build logs in Koyeb dashboard

### App Won't Start
- Verify `PORT` environment variable
- Check `npm start` works locally
- Review application logs

### Static Assets 404
- Ensure `next.config.js` has correct `distDir`
- For static export, verify `output: 'export'`

## Example Repositories

- Official Example: https://github.com/koyeb/example-nextjs
- Deploy Button Demo: https://github.com/koyeb/example-nextjs#deploy-to-koyeb
