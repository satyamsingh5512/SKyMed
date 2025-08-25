#!/bin/bash

# SkyMed Netlify Deployment Script
echo "🌐 SkyMed Emergency Delivery System - Netlify Deployment"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version is $NODE_VERSION. Recommended version is 18+."
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your project root."
    exit 1
fi

# Install dependencies
print_info "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check environment variables
print_info "Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        print_status "Environment variables found in .env"
    else
        print_warning "Missing Supabase environment variables in .env"
        print_info "Make sure to add them in Netlify dashboard after deployment"
    fi
else
    print_warning "No .env file found"
    print_info "Make sure to add environment variables in Netlify dashboard"
fi

# Build the project
print_info "Building project for production..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Build completed successfully"
    BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    print_info "Build size: $BUILD_SIZE"
else
    print_error "Build failed. Please fix errors and try again."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    print_status "Git repository initialized"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_info "Committing changes..."
    git add .
    git commit -m "Netlify deployment: $(date '+%Y-%m-%d %H:%M:%S')"
    print_status "Changes committed"
fi

# Check if Netlify CLI is installed
if command -v netlify &> /dev/null; then
    print_info "Netlify CLI found. You can deploy directly with:"
    echo "netlify deploy --prod --dir=dist"
    echo ""
    read -p "Deploy now with Netlify CLI? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        if [ $? -eq 0 ]; then
            print_status "Deployment successful!"
        else
            print_error "Deployment failed"
        fi
    fi
else
    print_info "Netlify CLI not found. Install with: npm install -g netlify-cli"
fi

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    print_info "Pushing to GitHub..."
    git push origin main
    if [ $? -eq 0 ]; then
        print_status "Successfully pushed to GitHub"
    else
        print_error "Failed to push to GitHub"
    fi
else
    print_warning "No remote origin found."
    print_info "Add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/skymed-app.git"
    echo "git push -u origin main"
fi

echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Connect your GitHub repository"
echo "4. Configure build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "   - Node version: 18"
echo ""
echo "5. Add environment variables:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "6. Deploy and update Supabase redirect URLs"
echo ""
echo "📖 See NETLIFY_DEPLOYMENT.md for detailed instructions"
echo ""

# Check for video files
if [ -d "public/mediafiles" ]; then
    VIDEO_COUNT=$(find public/mediafiles -name "*.mp4" | wc -l)
    if [ "$VIDEO_COUNT" -gt 0 ]; then
        print_status "Found $VIDEO_COUNT video files in mediafiles directory"
        TOTAL_SIZE=$(du -sh public/mediafiles 2>/dev/null | cut -f1)
        print_info "Total video size: $TOTAL_SIZE"
        if [ -n "$TOTAL_SIZE" ] && [[ "$TOTAL_SIZE" =~ ([0-9]+)M ]] && [ "${BASH_REMATCH[1]}" -gt 100 ]; then
            print_warning "Video files are large. Consider using a CDN for better performance."
        fi
    else
        print_warning "No video files found in public/mediafiles/"
        print_info "Add your video files to public/mediafiles/ directory"
    fi
else
    print_warning "mediafiles directory not found"
    print_info "Create public/mediafiles/ and add your video files"
fi

# Final checklist
echo ""
echo "✅ Pre-deployment Checklist:"
echo "   ✅ Dependencies installed"
echo "   ✅ Build successful"
echo "   ✅ Git repository ready"
if [ -f ".env" ]; then
    echo "   ✅ Environment variables configured locally"
else
    echo "   ⚠️  Environment variables need to be added in Netlify"
fi
if [ "$VIDEO_COUNT" -gt 0 ]; then
    echo "   ✅ Video files found"
else
    echo "   ⚠️  Video files need to be added"
fi

echo ""
print_status "Ready for Netlify deployment! 🚀"