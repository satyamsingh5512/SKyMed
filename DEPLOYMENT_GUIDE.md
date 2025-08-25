# SkyMed Deployment Guide

This guide covers deploying your SkyMed Emergency Delivery System to Vercel and Netlify.

## 🚀 Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Your project pushed to GitHub

### Step 1: Prepare Your Project

1. **Update your build script** in `package.json`:
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

2. **Create `vercel.json`** in your project root:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

3. **Update `.gitignore`** to exclude sensitive files:
```
# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/

# Dependencies
node_modules/
```

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - SkyMed Emergency Delivery System"

# Add remote repository
git remote add origin https://github.com/yourusername/skymed-app.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

6. **Click "Deploy"**

### Step 4: Update Supabase Settings

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → URL Configuration**
3. **Add your Vercel domain**:
   - Site URL: `https://your-app-name.vercel.app`
   - Redirect URLs: `https://your-app-name.vercel.app/**`

---

## 🌐 Option 2: Deploy to Netlify

### Step 1: Prepare Your Project

1. **Create `netlify.toml`** in your project root:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

2. **Create `_redirects`** file in `public/` folder:
```
/*    /index.html   200
```

### Step 2: Deploy to Netlify

#### Method A: GitHub Integration (Recommended)

1. **Push your code to GitHub** (same as Vercel steps above)
2. **Go to [netlify.com](https://netlify.com)** and sign in
3. **Click "New site from Git"**
4. **Connect to GitHub** and select your repository
5. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

6. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

7. **Click "Deploy site"**

#### Method B: Drag & Drop

1. **Build your project locally**:
```bash
npm run build
```

2. **Go to [netlify.com](https://netlify.com)**
3. **Drag and drop** the `dist` folder to the deploy area
4. **Add environment variables** in Site Settings

### Step 3: Update Supabase Settings

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → URL Configuration**
3. **Add your Netlify domain**:
   - Site URL: `https://your-app-name.netlify.app`
   - Redirect URLs: `https://your-app-name.netlify.app/**`

---

## 🔧 Environment Variables Setup

### Required Environment Variables
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### How to Get Supabase Credentials
1. **Go to your Supabase Dashboard**
2. **Navigate to Settings → API**
3. **Copy the Project URL** and **anon/public key**

---

## 🎯 Post-Deployment Checklist

### 1. Test Core Functionality
- [ ] Login page loads with videos
- [ ] Authentication works (email/password)
- [ ] Dashboard displays correctly
- [ ] Demo user creation works
- [ ] Maps functionality works
- [ ] Dark/light theme toggle works

### 2. Update OAuth Settings (if using Google Auth)
- [ ] Add production domain to Google Cloud Console
- [ ] Update authorized redirect URIs
- [ ] Test Google OAuth flow

### 3. Database Setup
- [ ] Run database migrations in Supabase
- [ ] Create demo users using the Demo User Manager
- [ ] Test delivery creation and tracking

### 4. Performance Optimization
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers

---

## 🚨 Troubleshooting

### Common Issues

#### 1. "Failed to load resource" errors
- **Check environment variables** are set correctly
- **Verify Supabase URL** and keys are valid
- **Check browser console** for specific errors

#### 2. Authentication not working
- **Update Supabase redirect URLs** with your production domain
- **Check OAuth provider settings** (Google, etc.)
- **Verify RLS policies** in Supabase

#### 3. Videos not loading
- **Check video file paths** in `public/mediafiles/`
- **Verify video files** are included in build
- **Test with different video formats** (MP4 recommended)

#### 4. Routing issues (404 on refresh)
- **Verify redirect rules** are set up correctly
- **Check `vercel.json` or `netlify.toml`** configuration
- **Ensure SPA routing** is configured

### Debug Commands
```bash
# Check build locally
npm run build
npm run preview

# Check environment variables
echo $VITE_SUPABASE_URL

# Test production build
npm run build && npx serve dist
```

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Both Vercel and Netlify support automatic deployments:

1. **Connect your repository** during initial setup
2. **Every push to main branch** triggers a new deployment
3. **Preview deployments** for pull requests
4. **Rollback capability** if issues occur

### Branch Deployments
- **Production**: `main` branch → `your-app.vercel.app`
- **Staging**: `develop` branch → `develop--your-app.vercel.app`
- **Feature**: `feature-branch` → `feature-branch--your-app.vercel.app`

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- **Enable Vercel Analytics** in project settings
- **Monitor performance** and user behavior
- **Track Core Web Vitals**

### Netlify Analytics
- **Enable Netlify Analytics** (paid feature)
- **Monitor traffic** and performance
- **Set up form handling** for contact forms

---

## 🔐 Security Best Practices

### Environment Variables
- **Never commit** `.env` files to Git
- **Use different keys** for production vs development
- **Rotate keys regularly**

### Supabase Security
- **Enable RLS** on all tables
- **Review database policies**
- **Monitor auth logs**

### HTTPS & Headers
- **Force HTTPS** (enabled by default on both platforms)
- **Set security headers** in `vercel.json` or `netlify.toml`
- **Enable HSTS**

---

## 🎉 Success!

Your SkyMed Emergency Delivery System is now live! 

### Next Steps
1. **Share your app** with stakeholders
2. **Monitor performance** and user feedback
3. **Set up error tracking** (Sentry, LogRocket)
4. **Plan feature updates** and improvements

### Support
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs