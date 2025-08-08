// Test script for payment callback functionality
import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function testPaymentCallback() {
  console.log('🧪 Testing Payment Callback Functionality...\n');

  // Test 1: Successful payment callback
  console.log('1. Testing successful payment callback...');
  try {
    const successResponse = await fetch(`${BASE_URL}/api/payments/callback?order_id=test_order_123&payment_session_id=test_session_456&order_status=PAID&booking_id=test_booking_789`);
    console.log('✅ Success callback response status:', successResponse.status);
    console.log('✅ Success callback redirect URL:', successResponse.headers.get('location'));
  } catch (error) {
    console.error('❌ Success callback test failed:', error.message);
  }

  // Test 2: Failed payment callback
  console.log('\n2. Testing failed payment callback...');
  try {
    const failureResponse = await fetch(`${BASE_URL}/api/payments/callback?order_id=test_order_123&payment_session_id=test_session_456&order_status=FAILED&booking_id=test_booking_789&error_message=Payment%20declined`);
    console.log('✅ Failure callback response status:', failureResponse.status);
    console.log('✅ Failure callback redirect URL:', failureResponse.headers.get('location'));
  } catch (error) {
    console.error('❌ Failure callback test failed:', error.message);
  }

  // Test 3: Cancelled payment callback
  console.log('\n3. Testing cancelled payment callback...');
  try {
    const cancelResponse = await fetch(`${BASE_URL}/api/payments/cancel?order_id=test_order_123&booking_id=test_booking_789`);
    console.log('✅ Cancel callback response status:', cancelResponse.status);
    console.log('✅ Cancel callback redirect URL:', cancelResponse.headers.get('location'));
  } catch (error) {
    console.error('❌ Cancel callback test failed:', error.message);
  }

  // Test 4: Pending payment callback
  console.log('\n4. Testing pending payment callback...');
  try {
    const pendingResponse = await fetch(`${BASE_URL}/api/payments/callback?order_id=test_order_123&payment_session_id=test_session_456&order_status=ACTIVE&booking_id=test_booking_789`);
    console.log('✅ Pending callback response status:', pendingResponse.status);
    console.log('✅ Pending callback redirect URL:', pendingResponse.headers.get('location'));
  } catch (error) {
    console.error('❌ Pending callback test failed:', error.message);
  }

  console.log('\n🎉 Payment callback tests completed!');
  console.log('\n📝 Expected behavior:');
  console.log('- Success: Redirect to home with ?payment=success');
  console.log('- Failure: Redirect to home with ?payment=failed');
  console.log('- Cancelled: Redirect to home with ?payment=cancelled');
  console.log('- Pending: Redirect to home with ?payment=pending');
}

testPaymentCallback().catch(console.error);
