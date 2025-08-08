#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔥 Testing Frontend with Render Backend');
console.log('======================================');
console.log('');
console.log('💡 This will start your frontend locally but connect to the Render backend');
console.log('🌐 Backend: https://box-new.onrender.com');
console.log('📱 Frontend: Will start on http://localhost:8080');
console.log('');

// Set environment variables to point to Render backend
process.env.VITE_API_URL = 'https://box-new.onrender.com/api';

console.log('🚀 Starting frontend with Render backend...');

const frontend = spawn('vite', ['--host', '--port', '8080'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    VITE_API_URL: 'https://box-new.onrender.com/api'
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down frontend...');
  frontend.kill();
  process.exit(0);
});

frontend.on('error', (err) => {
  console.error('Failed to start frontend:', err);
  process.exit(1);
});

console.log('✅ Frontend started!');
console.log('📊 Health check: https://box-new.onrender.com/api/health');
console.log('🎯 Open: http://localhost:8080');
console.log('');
console.log('📋 Testing Checklist:');
console.log('   1. ✅ Frontend loads');
console.log('   2. ✅ User registration/login');
console.log('   3. ✅ Ground browsing');
console.log('   4. 🔍 Booking creation');
console.log('   5. 💳 Payment processing');
console.log('');
console.log('Press Ctrl+C to stop');
