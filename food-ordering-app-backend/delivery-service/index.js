// delivery-service/index.js
const express = require('express');
const app = express();
app.use(express.json());

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'delivery-service',
  brokers: ['kafka:9092']
});

// Consumer setup
const consumer = kafka.consumer({ groupId: 'delivery-group' });

async function startDeliveryConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payment-events' });
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      if (event.type === 'PAYMENT_PROCESSED') {
        scheduleDelivery(event.data);
      }
    }
  });
}

function scheduleDelivery(order) {
  console.log(`Scheduling delivery for order ${order.id}`);
  // Update order status
  updateOrderStatus(order.id, 'OUT_FOR_DELIVERY');
}

async function updateOrderStatus(orderId, status) {
  // REST call to order service
  const axios = require('axios');
  await axios.patch(`http://order-service:3002/orders/${orderId}`, { status });
}


startDeliveryConsumer();
app.listen(3004, () => console.log('Delivery service running on 3004'));