const axios = require('axios');

async function testServices() {
  try {
    console.log('Testing services directly...\n');
    
    // 1. Test Auth Service
    console.log('1. Testing Auth Service directly...');
    try {
      const authResponse = await axios.post('http://localhost:3000/api/auth/login', {
        email: 'test@test.com',
        password: 'Password123'
      });
      
      console.log('Auth service response:', authResponse.data);
      
      // Extract token for delivery service test
      let token;
      if (authResponse.data.token) {
        token = authResponse.data.token;
      } else if (authResponse.data.data && authResponse.data.data.token) {
        token = authResponse.data.data.token;
      }
      
      if (token) {
        console.log('Token received (first 20 chars):', token.substring(0, 20));
        
        // 2. Test Delivery Service
        console.log('\n2. Testing Delivery Service directly...');
        try {
          // Test health endpoint
          const healthResponse = await axios.get('http://localhost:3003/api/deliveries/health');
          console.log('Health endpoint response:', healthResponse.data);
          
          // Test profile endpoint with token
          const profileResponse = await axios.get('http://localhost:3003/api/deliveries/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Profile endpoint response:', profileResponse.data);
        } catch (deliveryError) {
          console.error('Delivery service error:', deliveryError.response?.data || deliveryError.message);
        }
      }
    } catch (authError) {
      console.error('Auth service error:', authError.response?.data || authError.message);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testServices();