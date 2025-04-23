const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const logger = require('../config/logger');
const config = require('../config/config');

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedError('No authentication token, access denied');
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Add user from payload to request
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to authorize user role
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to access this resource'));
    }
    
    next();
  };
};

/**
 * Middleware to check if user is a restaurant owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isRestaurantOwner = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('User not authenticated'));
  }
  
  if (req.user.role !== 'RESTAURANT_OWNER') {
    return next(new ForbiddenError('Only restaurant owners can access this resource'));
  }
  
  next();
};

module.exports = {
  authenticate,
  authorize,
  isRestaurantOwner
};