const Restaurant = require('../models/Restaurant');
const logger = require('../config/logger');

class RestaurantService {
  async createRestaurant(restaurantData) {
    try {
      const restaurant = new Restaurant(restaurantData);
      await restaurant.validate();
      return await restaurant.save();
    } catch (error) {
      logger.error('Error creating restaurant:', error);
      throw new Error(`Failed to create restaurant: ${error.message}`);
    }
  }

  async addMenuItem(restaurantId, menuItem) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      const validationErrors = restaurant.validateMenuItem(menuItem);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      restaurant.menuItems.push(menuItem);
      return await restaurant.save();
    } catch (error) {
      logger.error('Error adding menu item:', error);
      throw error;
    }
  }

  async updateMenuItem(restaurantId, itemId, updateData) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      const menuItem = restaurant.menuItems.id(itemId);
      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      Object.assign(menuItem, updateData);
      await restaurant.save();
      return restaurant;
    } catch (error) {
      logger.error('Error updating menu item:', error);
      throw error;
    }
  }

  async deleteMenuItem(restaurantId, itemId) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      restaurant.menuItems.pull(itemId);
      return await restaurant.save();
    } catch (error) {
      logger.error('Error deleting menu item:', error);
      throw error;
    }
  }

  async addReview(restaurantId, reviewData) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      restaurant.reviews.push(reviewData);
      restaurant.rating = this.calculateAverageRating(restaurant.reviews);
      return await restaurant.save();
    } catch (error) {
      logger.error('Error adding review:', error);
      throw error;
    }
  }

  calculateAverageRating(reviews) {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }

  async updateRestaurantAvailability(restaurantId, isAvailable) {
    try {
      return await Restaurant.findByIdAndUpdate(
        restaurantId, 
        { isAvailable }, 
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating restaurant availability:', error);
      throw error;
    }
  }

  async getRestaurantDetails(restaurantId) {
    try {
      return await Restaurant.findById(restaurantId)
        .populate('owner', 'name email');
    } catch (error) {
      logger.error('Error fetching restaurant details:', error);
      throw error;
    }
  }

  async searchRestaurants(query) {
    try {
      const { cuisine, name, minPrice, maxPrice } = query;
      
      // Build dynamic search conditions
      const searchConditions = {};
      
      if (cuisine) searchConditions.cuisine = cuisine;
      if (name) searchConditions.name = { $regex: name, $options: 'i' };
      
      // Price filtering for menu items
      if (minPrice || maxPrice) {
        searchConditions['menuItems.price'] = {};
        if (minPrice) searchConditions['menuItems.price'].$gte = minPrice;
        if (maxPrice) searchConditions['menuItems.price'].$lte = maxPrice;
      }

      return await Restaurant.find(searchConditions)
        .select('name cuisine address menuItems');
    } catch (error) {
      logger.error('Restaurant search failed:', error);
      throw error;
    }
  }

  async updateRestaurant(restaurantId, updateData) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      Object.assign(restaurant, updateData);
      await restaurant.validate();
      return await restaurant.save();
    } catch (error) {
      logger.error('Error updating restaurant:', error);
      throw error;
    }
  }

  async deleteRestaurant(restaurantId) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      await restaurant.remove();
      return { success: true };
    } catch (error) {
      logger.error('Error deleting restaurant:', error);
      throw error;
    }
  }
}

module.exports = new RestaurantService();