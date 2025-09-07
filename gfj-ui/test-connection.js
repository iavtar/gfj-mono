// Test script to verify frontend-backend connection
// Run with: node test-connection.js

const axios = require('axios');

const testConnection = async () => {
  const baseURL = 'http://localhost:8081';
  
  console.log('🔍 Testing backend connection...');
  console.log(`📍 Backend URL: ${baseURL}`);
  
  try {
    // Test basic connectivity
    console.log('\n1. Testing basic connectivity...');
    const response = await axios.get(`${baseURL}/api/auth/test`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Backend is accessible');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Response: ${response.data}`);
    
  } catch (error) {
    console.log('❌ Backend connection failed');
    console.log(`🚨 Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure the backend is running on port 8081');
      console.log('   - Check if Spring Boot application started successfully');
      console.log('   - Verify no other service is using port 8081');
    }
    
    if (error.response) {
      console.log(`   - HTTP Status: ${error.response.status}`);
      console.log(`   - Response: ${error.response.data}`);
    }
  }
  
  try {
    // Test CORS
    console.log('\n2. Testing CORS configuration...');
    const corsResponse = await axios.get(`${baseURL}/api/auth/test`, {
      timeout: 5000,
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ CORS is properly configured');
    console.log(`📊 CORS Headers: ${JSON.stringify(corsResponse.headers, null, 2)}`);
    
  } catch (error) {
    console.log('❌ CORS test failed');
    console.log(`🚨 Error: ${error.message}`);
  }
  
  console.log('\n🎯 Next steps:');
  console.log('   1. Start the backend: cd gfj-be && mvn spring-boot:run');
  console.log('   2. Start the frontend: cd gfj-ui && npm run dev:local');
  console.log('   3. Open browser to http://localhost:80');
};

// Run the test
testConnection().catch(console.error);
