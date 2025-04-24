const { BadRequestError } = require('../utils/errors');
const logger = require('../config/logger');

/**
 * Validate restaurant creation data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateRestaurantData = (req, res, next) => {
  try {
    const { name, description, cuisine, address, contact } = req.body;
    
    const errors = [];
    
    // Check required fields
    if (!name) errors.push('Restaurant name is required');
    if (!description) errors.push('Description is required');
    if (!cuisine) errors.push('Cuisine type is required');
    
    // Check address
    if (!address) {
      errors.push('Address is required');
    } else {
      if (!address.street) errors.push('Street address is required');
      if (!address.city) errors.push('City is required');
      if (!address.state) errors.push('State is required');
      if (!address.zipCode) errors.push('Zip code is required');
    }
    
    // Check contact
    if (!contact) {
      errors.push('Contact information is required');
    } else {
      if (!contact.phone) errors.push('Phone number is required');
      if (!contact.email) errors.push('Email is required');
    }
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.join(', '));
    }
    
    next();
  } catch (error) {
    logger.error(`Validation error: ${error.message}`);
    next(error);
  }
};

/**
 * Validate business hours data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateBusinessHours = (req, res, next) => {
  try {
    const { businessHours } = req.body;
    
    if (!businessHours || !Array.isArray(businessHours)) {
      throw new BadRequestError('Business hours must be an array');
    }
    
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const errors = [];
    
    businessHours.forEach((hour, index) => {
      if (!hour.day) {
        errors.push(`Day is required for business hour at index ${index}`);
      } else if (!validDays.includes(hour.day)) {
        errors.push(`Invalid day "${hour.day}" at index ${index}`);
      }
      
      if (!hour.open) errors.push(`Opening time is required for ${hour.day || `business hour at index ${index}`}`);
      if (!hour.close) errors.push(`Closing time is required for ${hour.day || `business hour at index ${index}`}`);
    });
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.join(', '));
    }
    
    next();
  } catch (error) {
    logger.error(`Validation error: ${error.message}`);
    next(error);
  }
};

/**
 * Validate delivery settings data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateDeliverySettings = (req, res, next) => {
  try {
    const { deliveryFee, minimumOrder, deliveryRadius, preparationTime } = req.body;
    
    const errors = [];
    
    if (deliveryFee !== undefined && (isNaN(deliveryFee) || deliveryFee < 0)) {
      errors.push('Delivery fee must be a non-negative number');
    }
    
    if (minimumOrder !== undefined && (isNaN(minimumOrder) || minimumOrder < 0)) {
      errors.push('Minimum order must be a non-negative number');
    }
    
    if (deliveryRadius !== undefined && (isNaN(deliveryRadius) || deliveryRadius <= 0)) {
      errors.push('Delivery radius must be a positive number');
    }
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.join(', '));
    }
    
    next();
  } catch (error) {
    logger.error(`Validation error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  validateRestaurantData,
  validateBusinessHours,
  validateDeliverySettings
};