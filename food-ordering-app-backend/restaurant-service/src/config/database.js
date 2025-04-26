const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

/**
 * Connect to MongoDB
 * @returns {Promise} Mongoose connection
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB
};