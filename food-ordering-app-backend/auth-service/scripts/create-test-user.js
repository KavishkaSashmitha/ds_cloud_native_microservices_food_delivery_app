require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const config = require('../config/config');

async function createTestUser() {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@test.com' });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      
      // Update password if needed
      existingUser.password = await bcrypt.hash('Password123', 10);
      await existingUser.save();
      console.log('Test user password updated');
    } else {
      // Create test user with DELIVERY_PERSON role
      const hashedPassword = await bcrypt.hash('Password123', 10);
      
      const testUser = new User({
        username: 'testdelivery',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'DELIVERY_PERSON',
        isVerified: true,
        profile: {
          firstName: 'Test',
          lastName: 'Delivery',
          phoneNumber: '555-1234'
        }
      });
      
      await testUser.save();
      console.log('Test user created successfully:', testUser.email);
    }
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();