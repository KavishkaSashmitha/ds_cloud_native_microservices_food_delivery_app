const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/jwtUtils');
const User = require('../models/User');

// Test endpoint to get JWT token
router.post('/test-token', async (req, res) => {
  try {
    // Create a test user
    const testUser = {
      _id: '123456789',
      email: 'test@example.com',
      role: 'restaurant_admin'
    };

    const token = generateToken(testUser);
    
    res.json({
      message: 'Test token generated successfully',
      token,
      user: testUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
