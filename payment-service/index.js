// payment-service/index.js
const express = require('express');
const app = express();
app.use(express.json());

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: ['kafka:9092']
});

// Kafka consumer
const consumer = kafka.consumer({ groupId: 'payment-group' });

async function startPaymentConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events' });
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      if (event.type === 'ORDER_CREATED') {
        processPayment(event.data);
      }
    }
  });
}

function processPayment(order) {
  // Mock payment processing
  console.log(`Processing payment for order ${order.id}`);
  // Send payment event
  producePaymentEvent('PAYMENT_PROCESSED', order);
}

async function producePaymentEvent(eventType, order) {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: 'payment-events',
    messages: [{
      value: JSON.stringify({
        type: eventType,
        data: order
      })
    }]
  });
}

startPaymentConsumer();
app.listen(3003, () => console.log('Payment service running on 3003'));