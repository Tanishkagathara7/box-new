#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

console.log('🚀 Pushing Fixes to Render');
console.log('========================');

// Check if we're in a git repository
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit', shell: true });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function pushFixes() {
  try {
    console.log('📝 Checking git status...');
    await runCommand('git', ['status']);
    
    console.log('\n📦 Adding files to git...');
    await runCommand('git', ['add', '.']);
    
    console.log('\n💬 Committing changes...');
    const commitMessage = 'Fix: Vercel deployment issues - API URL, CORS, payment gateway';
    await runCommand('git', ['commit', '-m', commitMessage]);
    
    console.log('\n🚀 Pushing to Render...');
    await runCommand('git', ['push']);
    
    console.log('\n✅ Changes pushed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. ✅ Wait for Render to deploy (2-3 minutes)');
    console.log('2. ✅ Update Vercel environment variables:');
    console.log('   - VITE_API_URL=https://box-new.onrender.com/api');
    console.log('   - NODE_ENV=production');
    console.log('3. ✅ Redeploy Vercel');
    console.log('4. ✅ Test: https://box-new.vercel.app');
    
    console.log('\n🔍 Monitor Render deployment:');
    console.log('https://dashboard.render.com');
    
    console.log('\n🧪 Test URLs after deployment:');
    console.log('- Backend Health: https://box-new.onrender.com/api/health');
    console.log('- Cashfree Test: https://box-new.onrender.com/api/payments/test-cashfree');
    console.log('- Frontend: https://box-new.vercel.app');
    
  } catch (error) {
    console.error('❌ Error pushing fixes:', error.message);
    console.log('\n🔧 Manual steps:');
    console.log('1. git add .');
    console.log('2. git commit -m "Fix: Vercel deployment issues"');
    console.log('3. git push');
  }
}

pushFixes();
