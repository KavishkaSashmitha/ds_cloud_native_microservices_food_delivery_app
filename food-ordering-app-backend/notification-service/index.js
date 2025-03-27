// notification-service/index.js
const amqp = require('amqplib');
const axios = require('axios');

async function startNotificationConsumer() {
  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  
  const exchange = 'notifications';
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  
  const q = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(q.queue, exchange, '');
  
  channel.consume(q.queue, (msg) => {
    if (msg.content) {
      const notification = JSON.parse(msg.content.toString());
      sendNotification(notification);
    }
  }, { noAck: true });
}

function sendNotification(notification) {
  console.log(`Sending ${notification.type} to ${notification.userId}`);
  // Implement actual email/SMS logic
}

startNotificationConsumer();