// config/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate environment variables
const kafkaBrokers = process.env.KAFKA_BROKERS || 'localhost:9092';

// Initialize Kafka client with proper error handling
let kafka, producer, consumer;

try {
  console.log(`Connecting to Kafka brokers: ${kafkaBrokers}`);
  
  kafka = new Kafka({
    clientId: 'delivery-service',
    brokers: kafkaBrokers.split(','),
    retry: {
      initialRetryTime: 100,
      retries: 8
    }
  });

  // Create producer and consumer instances
  producer = kafka.producer();
  consumer = kafka.consumer({ groupId: 'delivery-group' });
} catch (err) {
  console.error(`Error initializing Kafka: ${err.message}`);
}

// Connection functions
const connect = async () => {
  if (!producer || !consumer) {
    console.log('Kafka not properly initialized, using mock services');
    return;
  }
  
  try {
    console.log('Attempting to connect to Kafka...');
    await producer.connect();
    await consumer.connect();
    console.log('Connected to Kafka');
    return true;
  } catch (error) {
    console.error(`Failed to connect to Kafka: ${error.message}`);
    return false;
  }
};

const disconnect = async () => {
  if (!producer || !consumer) return;
  
  try {
    await producer.disconnect();
    await consumer.disconnect();
    console.log('Disconnected from Kafka');
  } catch (error) {
    console.error(`Error disconnecting from Kafka: ${error.message}`);
  }
};

module.exports = {
  kafka,
  producer,
  consumer,
  connect,
  disconnect
};