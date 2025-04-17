const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-service', {
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,  // 45 seconds
      serverSelectionTimeoutMS: 5000, // 5 seconds
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10
    });

    // Test the connection with a ping
    await conn.connection.db.admin().ping();
    logger.info('Successfully pinged the database. Connection is working.');

    // Monitor database connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose connection is disconnected');
    });

    // If Node process ends, close the MongoDB connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection disconnected through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error('Database connection error:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    process.exit(1);
  }
};

// Function to check if database is connected
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isDatabaseConnected
};