require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');
const { connectDB } = require('./config/database');
const kafkaConsumerService = require('./services/kafkaConsumerService');
const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/deliveries', deliveryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'delivery-service',
    kafkaConsumer: kafkaConsumerService.isRunning() ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start the server
const startServer = async () => {
  try {
    // Try to connect to MongoDB (will be skipped if USE_MOCK_SERVICES=true)
    await connectDB();
    
    // Start Kafka consumer service (will use mocks if needed)
    await kafkaConsumerService.start();
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Delivery service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    // Don't exit here, start the server anyway with reduced functionality
    app.listen(PORT, () => {
      logger.info(`Delivery service running on port ${PORT} with limited functionality`);
    });
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received. Shutting down gracefully');
  await kafkaConsumerService.stop();
  process.exit(0);
});