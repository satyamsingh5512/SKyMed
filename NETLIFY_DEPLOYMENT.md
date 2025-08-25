# 🌐 SkyMed - Complete Netlify Deployment Guide

Deploy your SkyMed Emergency Delivery System to Netlify with this comprehensive guide.

## 🚀 Quick Deploy (5 Minutes)

### Method 1: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

### Method 2: GitHub Integration (Recommended)

```bash
# 1. Build and push to GitHub
npm run build
git add .
git commit -m "Ready for Netlify deployment"
git push origin main

# 2. Go to netlify.com → New site from Git
# 3. Connect GitHub → Select repository
# 4. Deploy!
```

---

## 📋 Step-by-Step Netlify Deployment

### Step 1: Prepare Your Project

#### 1.1 Update Package.json
```json
{
  "name": "skymed-emergency-delivery",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "netlify-build": "npm run build"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 1.2 Create Netlify Configuration
The `netlify.toml` file is already created with optimal settings:

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
  NPM_VERSION = "9"

# Performance optimizations
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Video files caching
[[headers]]
  for = "/mediafiles/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

#### 1.3 Environment Variables Setup
Create `.env.example` for reference:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=SkyMed
VITE_APP_VERSION=1.0.0
```

### Step 2: Deploy to Netlify

#### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Netlify deployment ready"
git push origin main
```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your repository

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

4. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL = https://shalookoiycpttkatrlr.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

5. **Deploy**: Click "Deploy site"

#### Option B: Drag & Drop Deploy

1. **Build locally**:
```bash
npm install
npm run build
```

2. **Deploy**:
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area
   - Site will be live instantly!

3. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add your Supabase credentials

#### Option C: Netlify CLI

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login and Deploy**:
```bash
# Login to Netlify
netlify login

# Build your project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Step 3: Configure Custom Domain (Optional)

1. **Go to Site settings → Domain management**
2. **Add custom domain**: `yourdomain.com`
3. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5
   ```
4. **Enable HTTPS** (automatic with Let's Encrypt)

---

## 🔧 Netlify-Specific Optimizations

### Performance Features

#### 1. Asset Optimization
```toml
# In netlify.toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true

[build.processing.images]
  compress = true
```

#### 2. Form Handling (for contact forms)
```html
<!-- Add to your contact form -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <!-- your form fields -->
</form>
```

#### 3. Function Deployment (for API endpoints)
Create `netlify/functions/` directory for serverless functions:

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from SkyMed API!" })
  };
};
```

### Security Enhancements

#### 1. Environment Variables
```bash
# Set via Netlify CLI
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key-here"
```

#### 2. Access Control
```toml
# In netlify.toml - Password protect staging
[[context.branch-deploy]]
  command = "npm run build"
  
[[context.branch-deploy.headers]]
  for = "/*"
  [context.branch-deploy.headers.values]
    X-Robots-Tag = "noindex"
```

---

## 🎯 Post-Deployment Configuration

### 1. Update Supabase Settings

1. **Go to Supabase Dashboard**
2. **Authentication → URL Configuration**:
   - **Site URL**: `https://your-site-name.netlify.app`
   - **Redirect URLs**: 
     ```
     https://your-site-name.netlify.app/**
     https://your-custom-domain.com/**
     ```

### 2. Test Core Functionality

#### Automated Testing Script
```bash
#!/bin/bash
echo "🧪 Testing SkyMed deployment..."

# Test main pages
curl -f https://your-site-name.netlify.app/ || echo "❌ Homepage failed"
curl -f https://your-site-name.netlify.app/login || echo "❌ Login page failed"

# Test API endpoints
curl -f https://your-site-name.netlify.app/.netlify/functions/hello || echo "⚠️ Functions not deployed"

echo "✅ Basic tests completed"
```

### 3. Enable Analytics

#### Netlify Analytics
```toml
# In netlify.toml
[build]
  command = "npm run build && npm run generate-sitemap"

# Enable analytics
[[plugins]]
  package = "@netlify/plugin-sitemap"
```

#### Google Analytics Integration
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### 1. Build Failures
```bash
# Check build logs in Netlify dashboard
# Common fixes:
npm install --legacy-peer-deps
npm run build --verbose

# Node version issues
echo "NODE_VERSION=18" >> .env
```

#### 2. Environment Variables Not Working
```bash
# Verify in Netlify dashboard
# Variables must start with VITE_ for Vite apps
VITE_SUPABASE_URL=https://...  ✅
SUPABASE_URL=https://...       ❌
```

#### 3. Routing Issues (404 on refresh)
```toml
# Ensure this is in netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 4. Video Files Not Loading
```bash
# Check file paths and sizes
ls -la public/mediafiles/
# Netlify has 100MB limit per file
# Consider using external CDN for large videos
```

#### 5. Supabase Connection Issues
```javascript
// Add to your app for debugging
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Environment:', import.meta.env.MODE);
```

### Debug Commands
```bash
# Local testing
npm run build && npx serve dist

# Check environment
netlify env:list

# View deploy logs
netlify logs

# Test functions locally
netlify dev
```

---

## 🔄 Continuous Deployment

### Branch Deployments
```toml
# In netlify.toml
[context.production]
  command = "npm run build"
  
[context.deploy-preview]
  command = "npm run build:preview"
  
[context.branch-deploy]
  command = "npm run build:staging"
```

### Deploy Hooks
```bash
# Trigger deploy via webhook
curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```

### Automated Testing
```yaml
# .github/workflows/netlify.yml
name: Netlify Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
```

---

## 📊 Monitoring & Performance

### Netlify Analytics Dashboard
- **Page views** and **unique visitors**
- **Top pages** and **referrers**
- **Bandwidth usage**
- **Form submissions**

### Performance Monitoring
```javascript
// Add to your app
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Performance tracking
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart);
});
```

### Error Tracking
```javascript
// Add error tracking
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Send to your error tracking service
});
```

---

## 🎉 Success Checklist

### Pre-Launch
- [ ] Build completes successfully
- [ ] Environment variables configured
- [ ] Supabase URLs updated
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### Post-Launch
- [ ] Login functionality works
- [ ] Video background loads
- [ ] Demo users can be created
- [ ] Maps functionality works
- [ ] Mobile responsiveness verified
- [ ] Performance scores > 90 (Lighthouse)

### Monitoring
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Uptime monitoring set up
- [ ] Backup strategy in place

---

## 🚀 Advanced Features

### Edge Functions
```javascript
// netlify/edge-functions/auth.js
export default async (request, context) => {
  const url = new URL(request.url);
  
  // Add custom authentication logic
  if (url.pathname.startsWith('/admin')) {
    // Check authentication
    return new Response('Unauthorized', { status: 401 });
  }
  
  return context.next();
};
```

### A/B Testing
```toml
# In netlify.toml
[[redirects]]
  from = "/login"
  to = "/login-v2"
  status = 200
  conditions = {Cookie = ["ab_test=variant_b"]}
```

### Scheduled Functions
```javascript
// netlify/functions/scheduled-cleanup.js
const { schedule } = require('@netlify/functions');

const handler = schedule('0 2 * * *', async (event, context) => {
  // Daily cleanup at 2 AM
  console.log('Running scheduled cleanup...');
  return { statusCode: 200 };
});

module.exports = { handler };
```

---

## 📞 Support & Resources

### Netlify Resources
- **Documentation**: https://docs.netlify.com
- **Community**: https://community.netlify.com
- **Status**: https://netlifystatus.com

### SkyMed Specific
- **GitHub Issues**: Create issues for bugs
- **Deployment Logs**: Check Netlify dashboard
- **Performance**: Use Lighthouse for optimization

### Quick Links
- **Netlify Dashboard**: https://app.netlify.com
- **Domain Management**: Site Settings → Domain management
- **Environment Variables**: Site Settings → Environment variables
- **Build Settings**: Site Settings → Build & deploy

---

🎉 **Your SkyMed Emergency Delivery System is now live on Netlify!**

Share your deployment: `https://your-site-name.netlify.app`