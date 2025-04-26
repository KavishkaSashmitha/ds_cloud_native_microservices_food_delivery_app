const axios = require('axios');

// Configuration
const API_GATEWAY_URL = 'http://localhost:8080';
const AUTH_URL = 'http://localhost:3000/api/auth';
const DELIVERY_URL = 'http://localhost:3003/api/deliveries';

// Test credentials (adjust as needed)
const credentials = {
  email: 'test@test.com',
  password: 'Password123'
};

// Main test function
async function testDeliveryService() {
  try {
    console.log('Starting delivery service API test...');
    
    // Step 1: Test health endpoints
    console.log('\n1. Testing health endpoints...');
    try {
      const gatewayHealth = await axios.get(`${API_GATEWAY_URL}/health`);
      console.log('API Gateway health:', gatewayHealth.data);
      
      const deliveryHealth = await axios.get(`${API_GATEWAY_URL}/delivery/health`);
      console.log('Delivery service health (via gateway):', deliveryHealth.data);
      
      const directHealth = await axios.get(`${DELIVERY_URL}/health`);
      console.log('Delivery service health (direct):', directHealth.data);
    } catch (error) {
      console.error('Health check failed:', error.response?.data || error.message);
    }
    
    // Step 2: Login to get a token
    console.log('\n2. Getting authentication token...');
    let token;
    try {
      const authResponse = await axios.post(`${API_GATEWAY_URL}/auth/login`, credentials);
      token = authResponse.data.token;
      console.log('Authentication successful! Token received.');
    } catch (error) {
      console.error('Authentication failed:', error.response?.data || error.message);
      return; // Stop if we can't authenticate
    }
    
    // Headers with authentication
    const authHeaders = { Authorization: `Bearer ${token}` };
    
    // Step 3: Test delivery profile
    console.log('\n3. Getting delivery profile...');
    try {
      const profileResponse = await axios.get(
        `${API_GATEWAY_URL}/delivery/profile`, 
        { headers: authHeaders }
      );
      console.log('Delivery profile:', profileResponse.data);
    } catch (error) {
      console.error('Profile retrieval failed:', error.response?.data || error.message);
    }
    
    // Step 4: Test available deliveries
    console.log('\n4. Getting available deliveries...');
    try {
      const availableResponse = await axios.get(
        `${API_GATEWAY_URL}/delivery/available`, 
        { headers: authHeaders }
      );
      console.log('Available deliveries:', availableResponse.data);
    } catch (error) {
      console.error('Available deliveries retrieval failed:', error.response?.data || error.message);
    }
    
    // Step 5: Test active deliveries
    console.log('\n5. Getting active deliveries...');
    try {
      const activeResponse = await axios.get(
        `${API_GATEWAY_URL}/delivery/active`, 
        { headers: authHeaders }
      );
      console.log('Active deliveries:', activeResponse.data);
    } catch (error) {
      console.error('Active deliveries retrieval failed:', error.response?.data || error.message);
    }
    
    // Step 6: Test delivery history
    console.log('\n6. Getting delivery history...');
    try {
      const historyResponse = await axios.get(
        `${API_GATEWAY_URL}/delivery/history`, 
        { headers: authHeaders }
      );
      console.log('Delivery history:', historyResponse.data);
    } catch (error) {
      console.error('History retrieval failed:', error.response?.data || error.message);
    }
    
    // Step 7: Test updating availability
    console.log('\n7. Updating availability status...');
    try {
      const availabilityResponse = await axios.put(
        `${API_GATEWAY_URL}/delivery/status`, 
        { isAvailable: true },
        { headers: authHeaders }
      );
      console.log('Availability updated:', availabilityResponse.data);
    } catch (error) {
      console.error('Availability update failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testDeliveryService();