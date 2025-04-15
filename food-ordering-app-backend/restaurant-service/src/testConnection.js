require('dotenv').config();
const { connectDB, isDatabaseConnected } = require('./config/database');
const logger = require('./config/logger');

const testConnection = async () => {
  try {
    await connectDB();
    
    // Wait a bit to ensure connection is established
    setTimeout(async () => {
      if (isDatabaseConnected()) {
        logger.info('Connection test successful! Database is connected.');
        
        // Exit successfully
        process.exit(0);
      } else {
        logger.error('Connection test failed! Database is not connected.');
        process.exit(1);
      }
    }, 2000);

  } catch (error) {
    logger.error('Connection test failed with error:', error);
    process.exit(1);
  }
};

testConnection();
