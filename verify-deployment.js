#!/usr/bin/env node

// Vercel Deployment Verification Script
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying SkyMed deployment readiness...\n');

const checks = [];

// Check 1: Required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  'vite.config.ts',
  'src/main.tsx',
  'src/App.tsx',
  'dist/index.html'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.push({ name: `✅ ${file} exists`, status: 'pass' });
  } else {
    checks.push({ name: `❌ ${file} missing`, status: 'fail' });
  }
});

// Check 2: API functions exist
const apiFiles = ['api/health.js', 'api/demo-data.js', 'api/stats.js'];
apiFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.push({ name: `✅ ${file} exists`, status: 'pass' });
  } else {
    checks.push({ name: `❌ ${file} missing`, status: 'fail' });
  }
});

// Check 3: Package.json has required dependencies
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['@supabase/supabase-js', 'react', 'react-dom', 'react-router-dom'];
  
  requiredDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      checks.push({ name: `✅ ${dep} dependency found`, status: 'pass' });
    } else {
      checks.push({ name: `❌ ${dep} dependency missing`, status: 'fail' });
    }
  });

  // Check scripts
  const requiredScripts = ['build', 'dev', 'preview'];
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      checks.push({ name: `✅ ${script} script found`, status: 'pass' });
    } else {
      checks.push({ name: `❌ ${script} script missing`, status: 'fail' });
    }
  });
} catch (error) {
  checks.push({ name: `❌ Error reading package.json: ${error.message}`, status: 'fail' });
}

// Check 4: Vercel.json configuration
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  if (vercelConfig.framework === 'vite') {
    checks.push({ name: '✅ Vercel framework set to Vite', status: 'pass' });
  } else {
    checks.push({ name: '❌ Vercel framework not set to Vite', status: 'fail' });
  }

  if (vercelConfig.buildCommand) {
    checks.push({ name: '✅ Build command configured', status: 'pass' });
  } else {
    checks.push({ name: '❌ Build command missing', status: 'fail' });
  }

  if (vercelConfig.outputDirectory === 'dist') {
    checks.push({ name: '✅ Output directory set to dist', status: 'pass' });
  } else {
    checks.push({ name: '❌ Output directory not set to dist', status: 'fail' });
  }
} catch (error) {
  checks.push({ name: `❌ Error reading vercel.json: ${error.message}`, status: 'fail' });
}

// Check 5: Build output exists and is valid
if (fs.existsSync('dist') && fs.existsSync('dist/index.html')) {
  const indexHtml = fs.readFileSync('dist/index.html', 'utf8');
  if (indexHtml.includes('SkyMed') || indexHtml.includes('root')) {
    checks.push({ name: '✅ Build output is valid', status: 'pass' });
  } else {
    checks.push({ name: '❌ Build output seems invalid', status: 'fail' });
  }
} else {
  checks.push({ name: '❌ Build output missing (run npm run build)', status: 'fail' });
}

// Check 6: Environment variables template
if (fs.existsSync('.env.example')) {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  if (envExample.includes('VITE_SUPABASE_URL') && envExample.includes('VITE_SUPABASE_ANON_KEY')) {
    checks.push({ name: '✅ Environment variables template is correct', status: 'pass' });
  } else {
    checks.push({ name: '❌ Environment variables template incomplete', status: 'fail' });
  }
} else {
  checks.push({ name: '❌ .env.example file missing', status: 'fail' });
}

// Display results
console.log('📋 Deployment Readiness Report:');
console.log('================================\n');

const passed = checks.filter(check => check.status === 'pass').length;
const failed = checks.filter(check => check.status === 'fail').length;

checks.forEach(check => {
  console.log(check.name);
});

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! Your SkyMed app is ready for Vercel deployment.');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: ./deploy-vercel.sh');
  console.log('2. Or deploy via GitHub integration');
  console.log('3. Add environment variables in Vercel dashboard');
  console.log('4. Test your deployment\n');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above before deploying.');
  console.log('\n🔧 Common fixes:');
  console.log('- Run: npm install');
  console.log('- Run: npm run build');
  console.log('- Check your vercel.json configuration');
  console.log('- Ensure all required files are present\n');
}

process.exit(failed > 0 ? 1 : 0);