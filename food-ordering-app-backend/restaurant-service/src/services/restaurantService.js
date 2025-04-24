const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');

/**
 * Restaurant Service - Handles business logic for restaurant operations
 */
class RestaurantService {
  /**
   * Create a new restaurant
   * @param {Object} restaurantData - Restaurant data
   * @param {String} userId - User ID of the restaurant owner
   * @returns {Promise<Object>} Created restaurant
   */
  async createRestaurant(restaurantData, userId) {
    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: userId });
    
    if (existingRestaurant) {
      throw new BadRequestError('User already has a restaurant');
    }
    
    const restaurant = new Restaurant({
      ...restaurantData,
      owner: userId
    });
    
    return await restaurant.save();
  }

  /**
   * Get restaurant by ID
   * @param {String} restaurantId - Restaurant ID
   * @param {String} userId - User ID of the requester
   * @returns {Promise<Object>} Restaurant data
   */
  async getRestaurantById(restaurantId, userId) {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError('Invalid restaurant ID');
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }
    
    // Check if the user is the owner of the restaurant
    if (restaurant.owner.toString() !== userId) {
      throw new UnauthorizedError('You are not authorized to access this restaurant');
    }
    
    return restaurant;
  }

  /**
   * Get restaurant by owner ID
   * @param {String} userId - User ID of the restaurant owner
   * @returns {Promise<Object>} Restaurant data
   */
  async getRestaurantByOwner(userId) {
    const restaurant = await Restaurant.findOne({ owner: userId });
    
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found for this user');
    }
    
    return restaurant;
  }

  /**
   * Update restaurant
   * @param {String} restaurantId - Restaurant ID
   * @param {Object} updateData - Data to update
   * @param {String} userId - User ID of the requester
   * @returns {Promise<Object>} Updated restaurant
   */
  async updateRestaurant(restaurantId, updateData, userId) {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError('Invalid restaurant ID');
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }
    
    // Check if the user is the owner of the restaurant
    if (restaurant.owner.toString() !== userId) {
      throw new UnauthorizedError('You are not authorized to update this restaurant');
    }
    
    // Update the restaurant
    Object.assign(restaurant, updateData);
    restaurant.updatedAt = Date.now();
    
    return await restaurant.save();
  }

  /**
   * Delete restaurant
   * @param {String} restaurantId - Restaurant ID
   * @param {String} userId - User ID of the requester
   * @returns {Promise<Object>} Deletion result
   */
  async deleteRestaurant(restaurantId, userId) {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError('Invalid restaurant ID');
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }
    
    // Check if the user is the owner of the restaurant
    if (restaurant.owner.toString() !== userId) {
      throw new UnauthorizedError('You are not authorized to delete this restaurant');
    }
    
    return await Restaurant.findByIdAndDelete(restaurantId);
  }

  /**
   * Update restaurant business hours
   * @param {String} restaurantId - Restaurant ID
   * @param {Array} businessHours - New business hours
   * @param {String} userId - User ID of the requester
   * @returns {Promise<Object>} Updated restaurant
   */
  async updateBusinessHours(restaurantId, businessHours, userId) {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError('Invalid restaurant ID');
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }
    
    // Check if the user is the owner of the restaurant
    if (restaurant.owner.toString() !== userId) {
      throw new UnauthorizedError('You are not authorized to update this restaurant');
    }
    
    restaurant.businessHours = businessHours;
    restaurant.updatedAt = Date.now();
    
    return await restaurant.save();
  }

  /**
   * Update restaurant delivery settings
   * @param {String} restaurantId - Restaurant ID
   * @param {Object} deliverySettings - New delivery settings
   * @param {String} userId - User ID of the requester
   * @returns {Promise<Object>} Updated restaurant
   */
  async updateDeliverySettings(restaurantId, deliverySettings, userId) {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError('Invalid restaurant ID');
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }
    
    // Check if the user is the owner of the restaurant
    if (restaurant.owner.toString() !== userId) {
      throw new UnauthorizedError('You are not authorized to update this restaurant');
    }
    
    restaurant.deliverySettings = {
      ...restaurant.deliverySettings,
      ...deliverySettings
    };
    restaurant.updatedAt = Date.now();
    
    return await restaurant.save();
  }

  /**
   * Toggle restaurant open/closed status
   * @param {String} restaurantId - Restaurant ID
   * @param {String} userId - User ID of the requester
   * @returns {Promise<Object>} Updated restaurant
   */
  async toggleRestaurantStatus(restaurantId, userId) {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError('Invalid restaurant ID');
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }
    
    // Check if the user is the owner of the restaurant
    if (restaurant.owner.toString() !== userId) {
      throw new UnauthorizedError('You are not authorized to update this restaurant');
    }
    
    restaurant.isOpen = !restaurant.isOpen;
    restaurant.updatedAt = Date.now();
    
    return await restaurant.save();
  }
}

module.exports = new RestaurantService();