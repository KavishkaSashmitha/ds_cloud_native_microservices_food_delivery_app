const { consumer, connect } = require('../config/kafka');
const { logger } = require('../utils/logger');

// Dynamic service selection
let orderService;
try {
  if (process.env.USE_MOCK_SERVICES === 'true') {
    orderService = require('./mockOrderService');
    logger.info('Using mock order service');
  } else {
    orderService = require('./orderService');
    logger.info('Using real order service');
  }
} catch (error) {
  logger.error(`Error loading order service: ${error.message}`);
  // Default to mock service if there's an error loading the real one
  orderService = require('./mockOrderService');
}

class KafkaConsumerService {
  constructor() {
    this.running = false;
  }

  async start() {
    if (process.env.USE_MOCK_SERVICES === 'true') {
      logger.info('Mock services enabled, not connecting to Kafka');
      this.running = true;
      return;
    }
    
    try {
      // First connect to Kafka
      const connected = await connect();
      
      if (!connected) {
        logger.warn('Failed to connect to Kafka, service will still start but won\'t process messages');
        return;
      }
      
      await consumer.subscribe({ topic: 'order-events', fromBeginning: false });
      
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const event = JSON.parse(message.value.toString());
            logger.info(`Received event: ${event.type}`);
            
            switch (event.type) {
              case 'PAYMENT_PROCESSED':
                await orderService.createOrder({
                  orderId: event.data.orderId,
                  customerId: event.data.customerId,
                  restaurantId: event.data.restaurantId,
                  deliveryLocation: event.data.location,
                  items: event.data.items,
                  totalAmount: event.data.totalAmount,
                  status: 'OUT_FOR_DELIVERY'
                });
                break;

              case 'ORDER_CANCELLED':
                await orderService.updateOrderStatus(
                  event.data.orderId, 
                  'CANCELLED'
                );
                break;

              case 'DELIVERY_UPDATE':
                await orderService.updateOrderStatus(
                  event.data.orderId,
                  event.data.newStatus
                );
                break;

              default:
                logger.warn(`Unhandled event type: ${event.type}`);
            }
          } catch (error) {
            logger.error(`Error processing Kafka message: ${error.message}`, {
              stack: error.stack,
              event: message.value ? message.value.toString() : 'No message value'
            });
          }
        }
      });
      
      this.running = true;
      logger.info('Kafka consumer started successfully');
    } catch (error) {
      logger.error(`Failed to start Kafka consumer: ${error.message}`);
      // Don't throw error to allow service to start without Kafka
      this.running = false;
    }
  }
  
  async stop() {
    if (process.env.USE_MOCK_SERVICES === 'true') {
      this.running = false;
      return;
    }
    
    try {
      if (consumer) {
        await consumer.stop();
      }
      this.running = false;
      logger.info('Kafka consumer stopped');
    } catch (error) {
      logger.error(`Error stopping Kafka consumer: ${error.message}`);
    }
  }

  isRunning() {
    return this.running;
  }
}

module.exports = new KafkaConsumerService();