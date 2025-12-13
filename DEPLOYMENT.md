# Deviation.io Deployment Guide

This guide will walk you through deploying your NBA Props application to GitHub and Netlify.

## Architecture Overview

```
┌─────────────────┐
│   GitHub Repo   │
│  (deviation-io) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│          Netlify Platform           │
├─────────────────────────────────────┤
│  Next.js Frontend                   │
│  +                                  │
│  Serverless Functions (API)         │
│    ├─ /api/props                    │
│    ├─ /api/props/:id                │
│    └─ /api/props/stats              │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────┐
│  Neon Database  │
│  (PostgreSQL)   │
└─────────────────┘
```

## Prerequisites

- Git installed on your machine
- GitHub account
- Netlify account (free tier works!)
- Your Neon database URL

## Step 1: Create Netlify Account

1. Go to [https://www.netlify.com](https://www.netlify.com)
2. Click "Sign up" in the top right
3. Choose "Sign up with GitHub" (recommended for easier integration)
4. Authorize Netlify to access your GitHub account

## Step 2: Install Dependencies

Open terminal in the deployment folder and run:

```bash
cd /Users/bolajioloyede/Documents/deviation-io-deployment
npm install
```

This will install all required dependencies including:
- Next.js and React
- PostgreSQL driver (pg)
- Netlify Functions
- All UI components

## Step 3: Set Up GitHub Repository

### Initialize Git Repository

```bash
cd /Users/bolajioloyede/Documents/deviation-io-deployment
git init
git add .
git commit -m "Initial commit: Next.js app with Netlify Functions"
```

### Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `deviation-io`
3. Description: "NBA Props Prediction App with Next.js and Netlify Functions"
4. Choose: **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Push to GitHub

GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/deviation-io.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. Log in to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your repositories (if not already done)
5. Select the `deviation-io` repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: `netlify/functions`
7. Click "Show advanced" → "Add environment variable"
8. Add your environment variable:
   - **Key**: `NEON_DATABASE_URL`
   - **Value**: Your Neon database connection string
     ```
     postgresql://neondb_owner:npg_l7BMtNF6cxpq@ep-icy-lab-ael816aw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     ```
9. Click "Deploy site"

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Team: Your team
# - Site name: deviation-io (or auto-generated)
# - Build command: npm run build
# - Publish directory: .next
# - Functions directory: netlify/functions

# Set environment variables
netlify env:set NEON_DATABASE_URL "your_database_url_here"

# Deploy
netlify deploy --prod
```

## Step 5: Verify Deployment

After deployment completes (usually 2-3 minutes), you'll get a URL like:
```
https://deviation-io.netlify.app
```

### Test Your API Endpoints

1. **Test Props Endpoint**:
   ```
   https://deviation-io.netlify.app/api/props
   ```

2. **Test with Query Parameters**:
   ```
   https://deviation-io.netlify.app/api/props?limit=10&min_confidence=70
   ```

3. **Test Stats Endpoint**:
   ```
   https://deviation-io.netlify.app/api/props/stats
   ```

4. **Test Single Prop** (replace 1 with actual ID):
   ```
   https://deviation-io.netlify.app/api/props/1
   ```

## Step 6: Configure Custom Domain (Optional)

1. In Netlify Dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `deviation.io`)
4. Follow DNS configuration instructions
5. Netlify will automatically provision SSL certificate

## Environment Variables Reference

Your deployment needs this environment variable:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEON_DATABASE_URL` | PostgreSQL connection string from Neon | `postgresql://user:pass@host/db` |

The `NEXT_PUBLIC_API_URL` is set to `/api` in production, which Netlify automatically routes to your functions.

## File Structure

```
deviation-io-deployment/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions
├── netlify/
│   └── functions/         # Serverless API functions
│       ├── db.ts          # Database connection utility
│       ├── props.ts       # GET /api/props
│       ├── props-by-id.ts # GET /api/props/:id
│       └── stats.ts       # GET /api/props/stats
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── .env.local            # Local environment variables (not committed)
├── .env.example          # Environment variables template
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies
└── DEPLOYMENT.md         # This file

```

## Troubleshooting

### Build Fails

**Error**: `Module not found: Can't resolve 'pg'`

**Solution**: Make sure `pg` is in `dependencies` (not `devDependencies`) in package.json

### Database Connection Error

**Error**: `Failed to fetch props`

**Solution**:
1. Check Netlify environment variables are set correctly
2. Verify your Neon database URL is correct
3. Check Netlify function logs: Site → Functions → [function name] → Logs

### Functions Not Working

**Error**: 404 on `/api/props`

**Solution**:
1. Check `netlify.toml` has correct redirects
2. Verify functions are in `netlify/functions/` directory
3. Check build logs for function compilation errors

### View Netlify Logs

```bash
netlify logs:function props
netlify logs:function stats
netlify logs:function props-by-id
```

Or view in dashboard: Site → Functions → [function name] → Logs

## Updating Your Deployment

When you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Netlify will automatically:
1. Detect the push to GitHub
2. Build your application
3. Deploy the new version
4. No downtime!

## Local Development

To test locally with Netlify Functions:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run local development server
netlify dev
```

This starts:
- Next.js on http://localhost:3000
- Netlify Functions on http://localhost:8888/.netlify/functions/

## Cost Breakdown

### Free Tier Includes:
- ✅ Netlify: 300 build minutes/month, 100GB bandwidth
- ✅ Neon: 0.5GB storage, 3GB data transfer/month
- ✅ GitHub: Unlimited public/private repos

Your app should run completely free unless you get massive traffic!

## Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Rotate database credentials** if accidentally exposed
3. **Use environment variables** for all secrets
4. **Enable branch deploys** for testing before production

## Support

- Netlify Docs: https://docs.netlify.com
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs

## Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Site connected to GitHub repo
- [ ] Environment variable `NEON_DATABASE_URL` set
- [ ] Deployment successful
- [ ] API endpoints tested and working
- [ ] Frontend loads correctly

---

**Your site is now live!** Share your Netlify URL with the world! 🚀
