#!/bin/bash

# SkyMed Deployment Script
echo "🚀 SkyMed Emergency Delivery System - Deployment Script"
echo "=================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    echo "✅ Git repository initialized"
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes found. Committing..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "✅ Changes committed"
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found."
    echo "Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/skymed-app.git"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub"
    echo ""
    echo "🎉 Deployment initiated!"
    echo ""
    echo "Next steps:"
    echo "1. Go to Vercel.com or Netlify.com"
    echo "2. Import your GitHub repository"
    echo "3. Add environment variables:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "4. Deploy!"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi