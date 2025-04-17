const mongoose = require('mongoose');
const config = require('./config');
const logger = require('winston');

// Configure mongoose
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = { connectDB };
