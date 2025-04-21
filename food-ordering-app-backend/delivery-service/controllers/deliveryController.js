const deliveryService = require('../services/deliveryService');
const orderService = require('../services/orderService');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/errorHandlers');

exports.getNearbyOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const { radius = 5000 } = req.query; // default 5km radius
    
    const nearbyOrders = await orderService.findNearbyOrders(userId, radius);
    sendSuccessResponse(res, 200, nearbyOrders);
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to fetch nearby orders', error);
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    
    const updatedOrder = await deliveryService.acceptOrder(orderId, userId);
    sendSuccessResponse(res, 200, updatedOrder);
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to accept order', error);
  }
};

exports.markAsPickedUp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    
    const updatedOrder = await deliveryService.updateOrderStatus(
      orderId, 
      userId,
      'PICKED_UP'
    );
    sendSuccessResponse(res, 200, updatedOrder);
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to mark as picked up', error);
  }
};

// ... other controller methods