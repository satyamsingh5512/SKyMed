# Vercel Deployment Setup for AeroVita

## 🚀 Quick Deployment Steps

### 1. Environment Variables Setup
Add these environment variables in your Vercel dashboard:

```env
VITE_SUPABASE_URL=https://shalookoiycpttkatrlr.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_NAME=AeroVita
VITE_APP_VERSION=1.0.0
```

### 2. Deploy Options

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and deploy

#### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option C: Deployment Script
```bash
./deploy-vercel.sh
```

### 3. Vercel Configuration Features

✅ **Optimized Build**: Vite with code splitting and minification
✅ **Serverless API**: Health check, demo data, and stats endpoints
✅ **Security Headers**: XSS protection, HSTS, and content security
✅ **Caching**: Optimized asset caching for performance
✅ **CORS**: Properly configured for API endpoints

### 4. API Endpoints Available

Once deployed, your app will have these endpoints:
- `https://your-app.vercel.app/api/health` - System health check
- `https://your-app.vercel.app/api/demo-data` - Demo users and data
- `https://your-app.vercel.app/api/stats` - Real-time system statistics

### 5. Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test API endpoints
- [ ] Check Supabase connection
- [ ] Verify routing works correctly
- [ ] Test responsive design on mobile

### 6. Performance Optimizations

- **Code Splitting**: Vendor, router, and feature-based chunks
- **Asset Caching**: 1-year cache for static assets
- **Minification**: Terser for optimal bundle size
- **Tree Shaking**: Unused code elimination

### 7. Troubleshooting

**Build Fails?**
- Check Node.js version (18+ recommended)
- Verify all dependencies are installed
- Check for TypeScript errors

**API Not Working?**
- Verify environment variables in Vercel dashboard
- Check Supabase URL and key are correct
- Review function logs in Vercel dashboard

**Routing Issues?**
- Ensure `vercel.json` rewrites are configured
- Check React Router setup

### 8. Monitoring

Monitor your deployment:
- Vercel Analytics (built-in)
- Function logs in Vercel dashboard
- Performance metrics via `/api/health`

## 🎯 Next Steps

1. Deploy using your preferred method above
2. Add your Vercel URL to Supabase allowed origins
3. Test all functionality
4. Set up custom domain (optional)
5. Configure monitoring and alerts

Your AeroVita Emergency Delivery System is now optimized for Vercel! 🚁✨