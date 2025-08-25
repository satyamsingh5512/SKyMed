#!/bin/bash

# SkyMed Vercel Deployment Script
echo "⚡ SkyMed Emergency Delivery System - Vercel Deployment"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_highlight() {
    echo -e "${PURPLE}🚀 $1${NC}"
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

print_status "Node.js version: $(node -v)"

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
        SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d'=' -f2)
        print_info "Supabase URL: ${SUPABASE_URL:0:30}..."
    else
        print_warning "Missing Supabase environment variables in .env"
        print_info "Make sure to add them in Vercel dashboard after deployment"
    fi
else
    print_warning "No .env file found"
    print_info "Make sure to add environment variables in Vercel dashboard"
fi

# Build the project
print_info "Building project for production..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Build completed successfully"
    BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    print_info "Build size: $BUILD_SIZE"
    
    # Check build size warning
    if [ -n "$BUILD_SIZE" ] && [[ "$BUILD_SIZE" =~ ([0-9]+)M ]] && [ "${BASH_REMATCH[1]}" -gt 50 ]; then
        print_warning "Build size is large (${BUILD_SIZE}). Consider optimizing assets."
    fi
else
    print_error "Build failed. Please fix errors and try again."
    exit 1
fi

# Test the build locally
print_info "Testing build locally..."
timeout 5s npm run preview > /dev/null 2>&1 &
PREVIEW_PID=$!
sleep 2
if kill -0 $PREVIEW_PID 2>/dev/null; then
    print_status "Local preview server started successfully"
    kill $PREVIEW_PID 2>/dev/null
else
    print_warning "Could not start preview server (this is usually fine)"
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
    git commit -m "Vercel deployment: $(date '+%Y-%m-%d %H:%M:%S')"
    print_status "Changes committed"
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    print_status "Vercel CLI found"
    
    # Check if user is logged in
    if vercel whoami > /dev/null 2>&1; then
        print_status "Logged in to Vercel"
        print_info "You can deploy directly with: vercel --prod"
        echo ""
        read -p "Deploy now with Vercel CLI? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_highlight "Deploying to Vercel..."
            vercel --prod
            if [ $? -eq 0 ]; then
                print_status "Deployment successful!"
                print_highlight "Your SkyMed app is now live! 🎉"
            else
                print_error "Deployment failed"
            fi
        fi
    else
        print_warning "Not logged in to Vercel. Run: vercel login"
    fi
else
    print_info "Vercel CLI not found. Install with: npm install -g vercel"
fi

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    REPO_URL=$(git remote get-url origin)
    print_status "Git remote found: $REPO_URL"
    
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
print_highlight "Deployment preparation completed!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "🔗 Option 1: GitHub Integration (Recommended)"
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Import from GitHub"
echo "4. Select your repository"
echo "5. Configure settings:"
echo "   - Framework: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "   - Node.js Version: 18.x"
echo ""
echo "🔧 Option 2: Vercel CLI"
echo "1. Install: npm install -g vercel"
echo "2. Login: vercel login"
echo "3. Deploy: vercel --prod"
echo ""
echo "⚙️ Environment Variables to Add:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "📖 See VERCEL_DEPLOYMENT.md for detailed instructions"
echo ""

# Check for video files
if [ -d "public/mediafiles" ]; then
    VIDEO_COUNT=$(find public/mediafiles -name "*.mp4" | wc -l)
    if [ "$VIDEO_COUNT" -gt 0 ]; then
        print_status "Found $VIDEO_COUNT video files in mediafiles directory"
        TOTAL_SIZE=$(du -sh public/mediafiles 2>/dev/null | cut -f1)
        print_info "Total video size: $TOTAL_SIZE"
        if [ -n "$TOTAL_SIZE" ] && [[ "$TOTAL_SIZE" =~ ([0-9]+)M ]] && [ "${BASH_REMATCH[1]}" -gt 50 ]; then
            print_warning "Video files are large. Consider using a CDN for better performance."
            print_info "Vercel has a 100MB deployment limit. Large videos may cause issues."
        fi
    else
        print_warning "No video files found in public/mediafiles/"
        print_info "Add your video files to public/mediafiles/ directory"
    fi
else
    print_warning "mediafiles directory not found"
    print_info "Create public/mediafiles/ and add your video files"
fi

# Check vercel.json configuration
if [ -f "vercel.json" ]; then
    print_status "vercel.json configuration found"
else
    print_warning "vercel.json not found - creating basic configuration"
    cat > vercel.json << 'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
    print_status "Created basic vercel.json"
fi

# Final checklist
echo ""
echo "✅ Pre-deployment Checklist:"
echo "   ✅ Dependencies installed"
echo "   ✅ Build successful"
echo "   ✅ Git repository ready"
echo "   ✅ vercel.json configured"
if [ -f ".env" ]; then
    echo "   ✅ Environment variables configured locally"
else
    echo "   ⚠️  Environment variables need to be added in Vercel"
fi
if [ "$VIDEO_COUNT" -gt 0 ]; then
    echo "   ✅ Video files found"
else
    echo "   ⚠️  Video files need to be added"
fi

echo ""
print_highlight "Ready for Vercel deployment! ⚡"
echo ""
print_info "🔗 Useful Links:"
echo "   • Vercel Dashboard: https://vercel.com/dashboard"
echo "   • GitHub Repository: https://github.com/satyamsingh5512/SKyMed"
echo "   • Supabase Dashboard: https://shalookoiycpttkatrlr.supabase.co"
echo ""
print_status "Happy deploying! 🚀"