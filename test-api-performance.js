#!/usr/bin/env node

import { performance } from 'perf_hooks';
// Use native fetch (Node 18+)
const fetch = globalThis.fetch;

const API_BASE = 'http://localhost:3001/api';

async function testEndpoint(url, description) {
  const start = performance.now();
  try {
    const response = await fetch(url);
    const end = performance.now();
    const data = await response.json();
    
    const responseTime = Math.round(end - start);
    const status = response.ok ? '✅' : '❌';
    
    console.log(`${status} ${description} - ${responseTime}ms`);
    if (!response.ok) {
      console.log(`   Error: ${data.message || 'Unknown error'}`);
    } else if (data.grounds) {
      console.log(`   Retrieved ${data.grounds.length} grounds`);
      if (data.usedCache) console.log('   🚀 Used cache!');
    }
    return { success: response.ok, responseTime, data };
  } catch (error) {
    const end = performance.now();
    const responseTime = Math.round(end - start);
    console.log(`❌ ${description} - ${responseTime}ms`);
    console.log(`   Error: ${error.message}`);
    return { success: false, responseTime, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing BoxCric API Performance');
  console.log('=====================================\n');

  const tests = [
    {
      url: `${API_BASE}/test`,
      description: 'Test endpoint'
    },
    {
      url: `${API_BASE}/health`,
      description: 'Health check'
    },
    {
      url: `${API_BASE}/grounds`,
      description: 'Get all grounds (basic request - should cache)'
    },
    {
      url: `${API_BASE}/grounds`,
      description: 'Get all grounds again (should use cache)'
    },
    {
      url: `${API_BASE}/grounds?cityId=mumbai`,
      description: 'Get Mumbai grounds'
    },
    {
      url: `${API_BASE}/grounds?cityId=delhi`,
      description: 'Get Delhi grounds'
    },
    {
      url: `${API_BASE}/grounds?search=cricket`,
      description: 'Search grounds with keyword'
    },
    {
      url: `${API_BASE}/grounds?minPrice=500&maxPrice=1500`,
      description: 'Filter by price range'
    }
  ];

  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description);
    results.push({ ...test, ...result });
    console.log(''); // Add space between tests
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n📊 Performance Summary');
  console.log('======================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    const avgResponseTime = Math.round(
      successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length
    );
    const maxResponseTime = Math.max(...successful.map(r => r.responseTime));
    const minResponseTime = Math.min(...successful.map(r => r.responseTime));
    
    console.log(`⏱️  Average response time: ${avgResponseTime}ms`);
    console.log(`🚀 Fastest: ${minResponseTime}ms`);
    console.log(`🐌 Slowest: ${maxResponseTime}ms`);
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed tests:');
    failed.forEach(test => {
      console.log(`   - ${test.description}: ${test.error}`);
    });
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, testEndpoint };
