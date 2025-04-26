const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPerson');
const { logger } = require('../utils/logger');

class DeliveryService {
  // Accept order by delivery person
  async acceptOrder(orderId, deliveryPersonId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Check if order is available for acceptance
      const order = await Order.findOne({
        _id: orderId,
        status: 'OUT_FOR_DELIVERY'
      }).session(session);
      
      if (!order) {
        throw new Error('Order not available for delivery');
      }
      
      // Check if delivery person is available
      const deliveryPerson = await DeliveryPerson.findOne({
        userId: deliveryPersonId,
        status: 'AVAILABLE'
      }).session(session);
      
      if (!deliveryPerson) {
        throw new Error('Delivery person not available');
      }
      
      // Update order and delivery person status
      order.status = 'DELIVERY_ACCEPTED';
      order.deliveryPersonId = deliveryPersonId;
      await order.save({ session });
      
      deliveryPerson.status = 'BUSY';
      deliveryPerson.currentDeliveryId = orderId;
      await deliveryPerson.save({ session });
      
      await session.commitTransaction();
      session.endSession();
      
      logger.info(`Order ${orderId} accepted by delivery person ${deliveryPersonId}`);
      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`Error accepting order: ${error.message}`);
      throw error;
    }
  }
  
  // Update order status by delivery person
  async updateDeliveryStatus(orderId, deliveryPersonId, newStatus) {
    // Validate status transition
    const validTransitions = {
      'DELIVERY_ACCEPTED': ['PICKED_UP'],
      'PICKED_UP': ['DELIVERED']
    };
    
    try {
      const order = await Order.findOne({
        _id: orderId,
        deliveryPersonId
      });
      
      if (!order) throw new Error('Order not found');
      if (!validTransitions[order.status]?.includes(newStatus)) {
        throw new Error('Invalid status transition');
      }
      
      order.status = newStatus;
      await order.save();
      
      // If delivery is complete, update delivery person status
      if (newStatus === 'DELIVERED') {
        await DeliveryPerson.updateOne(
          { userId: deliveryPersonId },
          { 
            status: 'AVAILABLE',
            currentDeliveryId: null,
            $inc: { completedDeliveries: 1 }
          }
        );
        logger.info(`Delivery completed for order ${orderId}`);
      }
      
      logger.info(`Order ${orderId} status updated to ${newStatus}`);
      return order;
    } catch (error) {
      logger.error(`Error updating delivery status: ${error.message}`);
      throw error;
    }
  }
  
  // Create a new order from Kafka message
  async createOrder(orderData) {
    try {
      logger.info(`Creating new delivery order: ${orderData.orderId}`);
      
      const newOrder = new Order({
        orderId: orderData.orderId,
        customerId: orderData.customerId,
        restaurantId: orderData.restaurantId,
        deliveryLocation: orderData.deliveryLocation,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        status: orderData.status || 'RECEIVED',
      });
      
      await newOrder.save();
      logger.info(`Order ${orderData.orderId} created successfully`);
      
      return newOrder;
    } catch (error) {
      logger.error(`Error creating order: ${error.message}`);
      throw error;
    }
  }
  
  // Update order status from Kafka message
  async updateOrderStatus(orderId, status) {
    try {
      logger.info(`Updating order ${orderId} status to ${status}`);
      
      const order = await Order.findOne({ orderId });
      
      if (!order) {
        logger.warn(`Order ${orderId} not found`);
        throw new Error('Order not found');
      }
      
      order.status = status;
      
      if (status === 'DELIVERED') {
        order.actualDeliveryTime = new Date();
      }
      
      await order.save();
      logger.info(`Order ${orderId} status updated to ${status}`);
      
      return order;
    } catch (error) {
      logger.error(`Error updating order status: ${error.message}`);
      throw error;
    }
  }
  
  // Get order by ID
  async getOrderById(orderId) {
    try {
      logger.info(`Fetching order ${orderId}`);
      const order = await Order.findOne({ orderId });
      
      if (!order) {
        logger.warn(`Order ${orderId} not found`);
        return null;
      }
      
      return order;
    } catch (error) {
      logger.error(`Error fetching order: ${error.message}`);
      throw error;
    }
  }
  
  // Get all orders
  async getAllOrders() {
    try {
      logger.info('Fetching all orders');
      const orders = await Order.find().sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      logger.error(`Error fetching all orders: ${error.message}`);
      throw error;
    }
  }
  
  // Get nearby orders for delivery person
  async getNearbyOrders(deliveryPersonId, radiusInMeters = 5000) {
    try {
      const deliveryPerson = await DeliveryPerson.findOne({ userId: deliveryPersonId });
      
      if (!deliveryPerson) {
        throw new Error('Delivery person not found');
      }
      
      // Find orders that are ready for delivery and not yet assigned
      const orders = await Order.find({
        status: 'OUT_FOR_DELIVERY',
        deliveryPersonId: { $exists: false }
      });
      
      // Here you would calculate distance to each order
      // For this simplified version, we'll just return all available orders
      
      return orders;
    } catch (error) {
      logger.error(`Error finding nearby orders: ${error.message}`);
      throw error;
    }
  }
  
}

module.exports = new DeliveryService();