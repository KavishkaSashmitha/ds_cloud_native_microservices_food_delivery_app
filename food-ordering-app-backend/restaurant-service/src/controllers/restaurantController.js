const restaurantService = require('../services/restaurantService');
const { successResponse } = require('../utils/responseHandler');
const logger = require('../config/logger');

/**
 * Restaurant Controller - Handles HTTP requests for restaurant operations
 */
class RestaurantController {
  /**
   * Create a new restaurant
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createRestaurant(req, res, next) {
    try {
      const userId = req.user.id;
      const restaurantData = req.body;
      
      const restaurant = await restaurantService.createRestaurant(restaurantData, userId);
      
      return successResponse(res, 201, 'Restaurant created successfully', restaurant);
    } catch (error) {
      logger.error(`Error creating restaurant: ${error.message}`);
      next(error);
    }
  }

  /**
   * Get restaurant profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getRestaurantProfile(req, res, next) {
    try {
      const userId = req.user.id;
      
      const restaurant = await restaurantService.getRestaurantByOwner(userId);
      
      return successResponse(res, 200, 'Restaurant profile retrieved successfully', restaurant);
    } catch (error) {
      logger.error(`Error retrieving restaurant profile: ${error.message}`);
      next(error);
    }
  }

  /**
   * Get restaurant by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getRestaurantById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const restaurant = await restaurantService.getRestaurantById(id, userId);
      
      return successResponse(res, 200, 'Restaurant retrieved successfully', restaurant);
    } catch (error) {
      logger.error(`Error retrieving restaurant: ${error.message}`);
      next(error);
    }
  }

  /**
   * Update restaurant profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateRestaurant(req, res, next) {
    try {
      const userId = req.user.id;
      const restaurant = await restaurantService.getRestaurantByOwner(userId);
      const updateData = req.body;
      
      const updatedRestaurant = await restaurantService.updateRestaurant(
        restaurant._id,
        updateData,
        userId
      );
      
      return successResponse(res, 200, 'Restaurant updated successfully', updatedRestaurant);
    } catch (error) {
      logger.error(`Error updating restaurant: ${error.message}`);
      next(error);
    }
  }

  /**
   * Update business hours
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateBusinessHours(req, res, next) {
    try {
      const userId = req.user.id;
      const restaurant = await restaurantService.getRestaurantByOwner(userId);
      const { businessHours } = req.body;
      
      const updatedRestaurant = await restaurantService.updateBusinessHours(
        restaurant._id,
        businessHours,
        userId
      );
      
      return successResponse(res, 200, 'Business hours updated successfully', updatedRestaurant);
    } catch (error) {
      logger.error(`Error updating business hours: ${error.message}`);
      next(error);
    }
  }

  /**
   * Update delivery settings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateDeliverySettings(req, res, next) {
    try {
      const userId = req.user.id;
      const restaurant = await restaurantService.getRestaurantByOwner(userId);
      const deliverySettings = req.body;
      
      const updatedRestaurant = await restaurantService.updateDeliverySettings(
        restaurant._id,
        deliverySettings,
        userId
      );
      
      return successResponse(res, 200, 'Delivery settings updated successfully', updatedRestaurant);
    } catch (error) {
      logger.error(`Error updating delivery settings: ${error.message}`);
      next(error);
    }
  }

  /**
   * Toggle restaurant open/closed status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async toggleRestaurantStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const restaurant = await restaurantService.getRestaurantByOwner(userId);
      
      const updatedRestaurant = await restaurantService.toggleRestaurantStatus(
        restaurant._id,
        userId
      );
      
      const status = updatedRestaurant.isOpen ? 'open' : 'closed';
      return successResponse(res, 200, `Restaurant is now ${status}`, updatedRestaurant);
    } catch (error) {
      logger.error(`Error toggling restaurant status: ${error.message}`);
      next(error);
    }
  }

  /**
   * Delete restaurant
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteRestaurant(req, res, next) {
    try {
      const userId = req.user.id;
      const restaurant = await restaurantService.getRestaurantByOwner(userId);
      
      await restaurantService.deleteRestaurant(restaurant._id, userId);
      
      return successResponse(res, 200, 'Restaurant deleted successfully', null);
    } catch (error) {
      logger.error(`Error deleting restaurant: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new RestaurantController();