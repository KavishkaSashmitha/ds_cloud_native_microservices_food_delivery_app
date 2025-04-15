const RestaurantService = require('../services/restaurantService');
const logger = require('../config/logger');

class RestaurantController {
  async createRestaurant(req, res) {
    try {
      const restaurant = await RestaurantService.createRestaurant(req.body);
      res.status(201).json({
        message: 'Restaurant created successfully',
        restaurant
      });
    } catch (error) {
      logger.error('Restaurant creation failed:', error);
      res.status(400).json({ 
        message: 'Restaurant creation failed', 
        error: error.message 
      });
    }
  }

  async addMenuItem(req, res) {
    try {
      const { restaurantId } = req.params;
      const menuItem = req.body;
      const updatedRestaurant = await RestaurantService.addMenuItem(restaurantId, menuItem);
      res.status(200).json({
        message: 'Menu item added successfully',
        restaurant: updatedRestaurant
      });
    } catch (error) {
      logger.error('Adding menu item failed:', error);
      res.status(400).json({ 
        message: 'Failed to add menu item', 
        error: error.message 
      });
    }
  }

  async updateMenuItem(req, res) {
    try {
      const { restaurantId, itemId } = req.params;
      const updateData = req.body;
      const updatedRestaurant = await RestaurantService.updateMenuItem(restaurantId, itemId, updateData);
      res.status(200).json({
        message: 'Menu item updated successfully',
        restaurant: updatedRestaurant
      });
    } catch (error) {
      logger.error('Updating menu item failed:', error);
      res.status(400).json({
        message: 'Failed to update menu item',
        error: error.message
      });
    }
  }

  async deleteMenuItem(req, res) {
    try {
      const { restaurantId, itemId } = req.params;
      await RestaurantService.deleteMenuItem(restaurantId, itemId);
      res.status(200).json({
        message: 'Menu item deleted successfully'
      });
    } catch (error) {
      logger.error('Deleting menu item failed:', error);
      res.status(400).json({
        message: 'Failed to delete menu item',
        error: error.message
      });
    }
  }

  async addReview(req, res) {
    try {
      const { restaurantId } = req.params;
      const reviewData = {
        ...req.body,
        userId: req.user._id,
        createdAt: new Date()
      };
      const updatedRestaurant = await RestaurantService.addReview(restaurantId, reviewData);
      res.status(201).json({
        message: 'Review added successfully',
        restaurant: updatedRestaurant
      });
    } catch (error) {
      logger.error('Adding review failed:', error);
      res.status(400).json({
        message: 'Failed to add review',
        error: error.message
      });
    }
  }

  async searchRestaurants(req, res) {
    try {
      const restaurants = await RestaurantService.searchRestaurants(req.query);
      res.status(200).json({
        message: 'Restaurants retrieved successfully',
        restaurants
      });
    } catch (error) {
      logger.error('Restaurant search failed:', error);
      res.status(500).json({ 
        message: 'Failed to search restaurants', 
        error: error.message 
      });
    }
  }

  async getRestaurantDetails(req, res) {
    try {
      const { restaurantId } = req.params;
      const restaurant = await RestaurantService.getRestaurantDetails(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.status(200).json({ restaurant });
    } catch (error) {
      logger.error('Fetching restaurant details failed:', error);
      res.status(500).json({ 
        message: 'Failed to fetch restaurant details', 
        error: error.message 
      });
    }
  }

  async updateRestaurant(req, res) {
    try {
      const { restaurantId } = req.params;
      const updateData = req.body;
      const restaurant = await RestaurantService.updateRestaurant(restaurantId, updateData);
      res.status(200).json({
        message: 'Restaurant updated successfully',
        restaurant
      });
    } catch (error) {
      logger.error('Restaurant update failed:', error);
      res.status(400).json({ 
        message: 'Failed to update restaurant', 
        error: error.message 
      });
    }
  }

  async deleteRestaurant(req, res) {
    try {
      const { restaurantId } = req.params;
      await RestaurantService.deleteRestaurant(restaurantId);
      res.status(200).json({
        message: 'Restaurant deleted successfully'
      });
    } catch (error) {
      logger.error('Restaurant deletion failed:', error);
      res.status(400).json({ 
        message: 'Failed to delete restaurant', 
        error: error.message 
      });
    }
  }
}

module.exports = new RestaurantController();