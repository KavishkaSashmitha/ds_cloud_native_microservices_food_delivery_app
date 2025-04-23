const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const config = require('./config/config');
const logger = require('./config/logger');
const restaurantRoutes = require('./routes/restaurantRoutes');
const { errorResponse } = require('./utils/responseHandler');
const { ApiError } = require('./utils/errors');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // HTTP request logging

// Routes
app.use('/api/restaurants', restaurantRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'restaurant-service' });
});

// 404 handler
app.use((req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  if (err.stack && config.app.env !== 'production') {
    logger.error(err.stack);
  }
  
  return errorResponse(res, statusCode, message, err.errors || null);
});

// Start server
const PORT = config.app.port;
app.listen(PORT, () => {
  logger.info(`Restaurant service running on port ${PORT} in ${config.app.env} mode`);
});

module.exports = app;