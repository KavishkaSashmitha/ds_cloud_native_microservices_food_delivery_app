// order-service/index.js
const express = require('express');
const app = express();
app.use(express.json());

let orders = [];
let orderId = 1;

app.post('/orders', (req, res) => {
  const order = {
    id: orderId++,
    items: req.body.items,
    userId: req.user.id,
    status: 'CREATED',
    total: req.body.total
  };
  orders.push(order);
  
  // Send order created event
  produceOrderEvent('ORDER_CREATED', order);
  
  res.status(201).json(order);
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  res.json(order);
});

// Kafka producer setup
const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

async function produceOrderEvent(eventType, order) {
  await producer.connect();
  await producer.send({
    topic: 'order-events',
    messages: [{
      value: JSON.stringify({
        type: eventType,
        data: order
      })
    }]
  });
}

app.listen(3002, () => console.log('Order service running on 3002'));