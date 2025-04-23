const mongoose = require('mongoose');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');

// Test database connection
const testConnection = async () => {
  try {
    await connectDB();
    logger.info('MongoDB connection test successful');
    
    // Check if connection is ready
    if (mongoose.connection.readyState === 1) {
      logger.info('Connection state: Connected');
    } else {
      logger.warn(`Connection state: ${mongoose.STATES[mongoose.connection.readyState]}`);
    }
    
    // Close connection after test
    await mongoose.connection.close();
    logger.info('Connection closed');
    
    return true;
  } catch (error) {
    logger.error(`MongoDB connection test failed: ${error.message}`);
    return false;
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then(result => {
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      logger.error(`Unexpected error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = testConnection;