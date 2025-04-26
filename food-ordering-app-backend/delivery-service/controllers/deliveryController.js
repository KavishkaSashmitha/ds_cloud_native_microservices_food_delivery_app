const { logger } = require('../config/logger');
const deliveryService = require('../services/deliveryService');

const deliveryController = {
  // Profile Management
  getDeliveryProfile: async (req, res) => {
    try {
      const profile = await deliveryService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      logger.error(`Error in getDeliveryProfile: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateDeliveryProfile: async (req, res) => {
    try {
      const { name, phone, vehicleType, vehicleNumber } = req.body;
      const profile = await deliveryService.updateProfile(req.user.id, {
        name,
        phone,
        vehicleType,
        vehicleNumber
      });
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile
      });
    } catch (error) {
      logger.error(`Error in updateDeliveryProfile: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateAvailabilityStatus: async (req, res) => {
    try {
      const { isAvailable } = req.body;
      if (typeof isAvailable !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isAvailable must be a boolean'
        });
      }
      
      const profile = await deliveryService.updateAvailability(req.user.id, isAvailable);
      
      res.status(200).json({
        success: true,
        message: `Availability status updated to ${isAvailable ? 'available' : 'unavailable'}`,
        data: profile
      });
    } catch (error) {
      logger.error(`Error in updateAvailabilityStatus: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // Available Deliveries
  getAvailableDeliveries: async (req, res) => {
    try {
      const deliveries = await deliveryService.getAvailableDeliveries();
      res.status(200).json({
        success: true,
        data: deliveries
      });
    } catch (error) {
      logger.error(`Error in getAvailableDeliveries: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  getNearbyDeliveries: async (req, res) => {
    try {
      const { latitude, longitude, radius = 10 } = req.query; // radius in km
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }
      
      const deliveries = await deliveryService.getNearbyDeliveries(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius)
      );
      
      res.status(200).json({
        success: true,
        data: deliveries
      });
    } catch (error) {
      logger.error(`Error in getNearbyDeliveries: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  acceptDelivery: async (req, res) => {
    try {
      const { deliveryId } = req.params;
      const delivery = await deliveryService.acceptDelivery(deliveryId, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Delivery accepted successfully',
        data: delivery
      });
    } catch (error) {
      logger.error(`Error in acceptDelivery: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // Active Deliveries
  getActiveDeliveries: async (req, res) => {
    try {
      const deliveries = await deliveryService.getActiveDeliveries(req.user.id);
      res.status(200).json({
        success: true,
        data: deliveries
      });
    } catch (error) {
      logger.error(`Error in getActiveDeliveries: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  updateDeliveryStatus: async (req, res) => {
    try {
      const { deliveryId } = req.params;
      const { status, currentLocation } = req.body;
      
      if (!status || !['PICKED_UP', 'ON_THE_WAY'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be PICKED_UP or ON_THE_WAY'
        });
      }
      
      const delivery = await deliveryService.updateDeliveryStatus(
        deliveryId, 
        req.user.id, 
        status, 
        currentLocation
      );
      
      res.status(200).json({
        success: true,
        message: `Delivery status updated to ${status}`,
        data: delivery
      });
    } catch (error) {
      logger.error(`Error in updateDeliveryStatus: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  completeDelivery: async (req, res) => {
    try {
      const { deliveryId } = req.params;
      const delivery = await deliveryService.completeDelivery(deliveryId, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Delivery completed successfully',
        data: delivery
      });
    } catch (error) {
      logger.error(`Error in completeDelivery: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // History & Stats
  getDeliveryHistory: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const history = await deliveryService.getDeliveryHistory(
        req.user.id,
        parseInt(page),
        parseInt(limit)
      );
      
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      logger.error(`Error in getDeliveryHistory: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  getDeliveryStats: async (req, res) => {
    try {
      const { period = 'week' } = req.query; // week, month, year
      const stats = await deliveryService.getDeliveryStats(req.user.id, period);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error(`Error in getDeliveryStats: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  getEarningsReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const earnings = await deliveryService.getEarningsReport(req.user.id, startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: earnings
      });
    } catch (error) {
      logger.error(`Error in getEarningsReport: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // Location management
  updateCurrentLocation: async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }
      
      await deliveryService.updateCurrentLocation(req.user.id, {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      });
      
      res.status(200).json({
        success: true,
        message: 'Location updated successfully'
      });
    } catch (error) {
      logger.error(`Error in updateCurrentLocation: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  getDeliveryRoute: async (req, res) => {
    try {
      const { deliveryId } = req.params;
      const route = await deliveryService.getDeliveryRoute(deliveryId, req.user.id);
      
      res.status(200).json({
        success: true,
        data: route
      });
    } catch (error) {
      logger.error(`Error in getDeliveryRoute: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = deliveryController;