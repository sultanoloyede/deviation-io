# Quick Start Guide - Deploy in 10 Minutes!

Follow these steps to get your app live on Netlify:

## 1️⃣ Install Dependencies (2 minutes)

```bash
cd /Users/bolajioloyede/Documents/deviation-io-deployment
npm install
```

## 2️⃣ Create GitHub Repository (3 minutes)

1. Go to https://github.com/new
2. Repository name: `deviation-io`
3. Choose Public or Private
4. **DO NOT** check any boxes (no README, .gitignore, etc.)
5. Click "Create repository"

6. Copy and run these commands (replace YOUR_USERNAME with your GitHub username):

```bash
cd /Users/bolajioloyede/Documents/deviation-io-deployment
git remote add origin https://github.com/YOUR_USERNAME/deviation-io.git
git push -u origin main
```

## 3️⃣ Create Netlify Account (2 minutes)

1. Go to https://www.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify

## 4️⃣ Deploy to Netlify (3 minutes)

1. In Netlify dashboard, click "Add new site" → "Import an existing project"
2. Click "Deploy with GitHub"
3. Find and select your `deviation-io` repository
4. **Build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions`

5. Click "Show advanced" → "Add environment variable"
   - **Key**: `NEON_DATABASE_URL`
   - **Value**:
     ```
     postgresql://neondb_owner:npg_l7BMtNF6cxpq@ep-icy-lab-ael816aw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     ```

6. Click "Deploy site"

## 5️⃣ Wait for Build (2-3 minutes)

Watch the build logs. You'll see:
- Installing dependencies
- Building Next.js app
- Deploying functions
- Site published!

## 6️⃣ Test Your Site

Once deployed, you'll get a URL like:
```
https://magical-word-12345.netlify.app
```

Test these endpoints:

1. Open the URL in browser - should see your frontend
2. Test API: `https://your-site.netlify.app/api/props`
3. Test with params: `https://your-site.netlify.app/api/props?limit=10`

## ✅ You're Live!

Your app is now:
- ✅ Hosted on Netlify
- ✅ Code on GitHub
- ✅ Database connected
- ✅ Auto-deploys on push

## 🔄 Making Changes

To update your live site:

```bash
# Make your changes to files
git add .
git commit -m "Describe your changes"
git push
```

Netlify will automatically rebuild and deploy!

## 🆘 Troubleshooting

### Build Failed
- Check Netlify build logs for errors
- Ensure environment variable is set correctly

### API Not Working
- Verify `NEON_DATABASE_URL` environment variable
- Check function logs: Site → Functions → [function name] → Logs

### Database Connection Error
- Double-check your Neon database URL
- Ensure database has data in `nba_props` table

## 📚 Full Documentation

For detailed information, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [README.md](./README.md) - Project documentation

## 🎉 Next Steps

1. **Custom Domain**: Add your own domain in Netlify settings
2. **Environment**: Set up production environment variables
3. **Monitoring**: Enable Netlify Analytics
4. **SSL**: Automatic with Netlify!

---

**Need Help?** Open an issue or check DEPLOYMENT.md for detailed troubleshooting.
