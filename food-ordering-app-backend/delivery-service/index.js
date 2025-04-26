require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger } = require('./config/logger');
const { connectDB } = require('./config/database');
const kafkaConsumerService = require('./services/kafkaConsumerService');
const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Role', 'X-User-Email']
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  
  // Debug headers for auth troubleshooting
  const authHeader = req.headers.authorization;
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  
  if (authHeader) {
    logger.debug(`Auth header: ${authHeader.substring(0, 20)}...`);
  }
  
  if (userId) {
    logger.debug(`X-User-Id: ${userId}`);
  }
  
  if (userRole) {
    logger.debug(`X-User-Role: ${userRole}`);
  }
  
  next();
});

// Health check endpoint (not behind auth) - used by API Gateway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'delivery-service',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/deliveries', deliveryRoutes);

// Debug endpoint - FOR DEVELOPMENT ONLY
app.post('/debug/verify-token', (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'QNH7W6d8UQHZmHh9jXPqr5V3YTsWeCF2';
    
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }
    
    logger.debug('Debug token:', token.substring(0, 30) + '...');
    logger.debug('JWT_SECRET:', JWT_SECRET.substring(0, 10) + '...');
    
    // Try to verify the token without throwing errors
    const decoded = jwt.decode(token);
    logger.debug('Decoded (without verification):', decoded);
    
    // Now try to verify
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      return res.json({
        success: true,
        message: 'Token is valid',
        decoded: verified
      });
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        message: 'Token verification failed',
        error: verifyError.message,
        decoded: decoded // Still return the decoded info
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Debug endpoint error',
      error: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    logger.info('Connected to database');
    
    if (process.env.ENABLE_KAFKA === 'true') {
      await kafkaConsumerService.start();
      logger.info('Kafka consumer started');
    }
    
    app.listen(PORT, () => {
      logger.info(`Delivery service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app; // For testing