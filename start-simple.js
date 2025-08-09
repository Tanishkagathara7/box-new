#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Starting BoxCric Development Environment');
console.log('==========================================');
console.log('💡 Using deployed backend and frontend URLs');
console.log('🌐 Backend: https://box-new.onrender.com');
console.log('📱 Frontend: https://box-new.vercel.app');
console.log('');

// Set environment variables for deployed URLs
process.env.VITE_API_URL = 'https://box-new.onrender.com/api';
process.env.FRONTEND_URL = 'https://box-new.vercel.app';
process.env.NODE_ENV = 'development';
// Explicitly unset PORT to avoid any backend startup
delete process.env.PORT;

console.log('🔧 Starting frontend with deployed backend...');
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

console.log('\n✅ Frontend starting with deployed backend...');
console.log('🔧 Backend: https://box-new.onrender.com (deployed)');
console.log('📱 Frontend: http://localhost:8080 (local)');
console.log('📊 Health check: https://box-new.onrender.com/api/health');
console.log('💳 Cashfree test: https://box-new.onrender.com/api/payments/test-cashfree');
console.log('');
console.log('🎯 This setup uses your deployed Render backend with local frontend');
console.log('📋 Perfect for testing booking flow with production backend');
console.log('\nPress Ctrl+C to stop all servers'); 