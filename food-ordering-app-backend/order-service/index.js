// order-service/index.js
const Order = require('./models/orderModel');
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const app = express();

app.use(express.json());
app.use("/", paymentRoutes);
app.use("/api/cart", cartRoutes);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Log when MongoDB connection is established
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Kafka producer setup
const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

async function produceOrderEvent(eventType, order) {
  try {
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
    console.log(`Event ${eventType} produced successfully`);
  } catch (error) {
    console.error('Error producing Kafka event:', error);
  }
}

// Create order endpoint
app.post('/orders', async (req, res) => {
  try {
    
    

    // Extract data from request body according to your model schema
    const { items, totalAmount, userId, deliveryAddress, paymentMethod } = req.body;
    console.log('Received order request:', req.body);
    console.log('Received total:', totalAmount);

    // if (!paymentMethod) {
    //   return res.status(400).json({ message: 'Payment method is required' });
    // }     

    // Validate required fields
if (!items || !Array.isArray(items) || items.length === 0) {
  return res.status(400).json({ message: 'Items are required and must be a non-empty array' });
}

const parsedTotal  = parseFloat(totalAmount);
if (!parsedTotal  || isNaN(parsedTotal )) {
  return res.status(400).json({ message: 'Total amount is required and must be a number' });
}
    
    // Create order based on your Order model schema
    const orderData = {
      user: new mongoose.Types.ObjectId(userId), // This should be an ObjectId that references a User
      items: items.map(item => ({
        foodId: new mongoose.Types.ObjectId(item.foodId),
        quantity: item.quantity
      })),
      totalAmount: parsedTotal ,
      deliveryAddress: deliveryAddress || "Default address",
      paymentMethod: paymentMethod 
    };

    console.log('Creating order with data:', orderData);
    
    // Create and save the order
    const order = new Order(orderData);
    
    // Debug the order object before saving
    console.log('Order model instance created:', order);
    
    // Save the order to MongoDB
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder);
    
    // Produce Kafka event (don't await to avoid blocking response)
    produceOrderEvent('ORDER_CREATED', savedOrder).catch(err => {
      console.error('Kafka event production failed but order was saved:', err);
    });
    
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
});

// Get order by ID endpoint
app.get('/orders/:id', async (req, res) => {
  try {
    console.log(`Retrieving order with ID: ${req.params.id}`);

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Failed to retrieve order:", error);

     if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    
    res.status(500).json({ message: 'Failed to retrieve order', error: error.message });
  }
});

// Get all orders endpoint for testing purposes
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(20);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
});

//  Update order status
app.put('/orders/:id', async (req, res) => {
    try {
        const { status, items, totalAmount, deliveryAddress, paymentMethod, userId } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: "Order not found" });

        // Update order fields if provided in request
        if (status) order.status = status;
        if (items) order.items = items.map(item => ({
            foodId: item.foodId,
            quantity: item.quantity
        }));
        if (totalAmount) order.totalAmount = totalAmount;
        if (deliveryAddress) order.deliveryAddress = deliveryAddress;
        if (paymentMethod) order.paymentMethod = paymentMethod;
        if (userId) order.user = userId;
        
        // Save the updated order
        const updatedOrder = await order.save();
        
        res.status(200).json({ msg: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Order update error:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

// Delete an order
app.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: "Order not found" });

        await order.deleteOne();
        res.status(200).json({ msg: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));