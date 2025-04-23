const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticate, isRestaurantOwner } = require('../middlewares/authMiddleware');
const {
  validateRestaurantData,
  validateBusinessHours,
  validateDeliverySettings
} = require('../middlewares/validationMiddleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply restaurant owner check to all routes
router.use(isRestaurantOwner);

// Create restaurant
router.post(
  '/',
  validateRestaurantData,
  restaurantController.createRestaurant
);

// Get restaurant profile
router.get(
  '/profile',
  restaurantController.getRestaurantProfile
);

// Update restaurant profile
router.put(
  '/profile',
  validateRestaurantData,
  restaurantController.updateRestaurant
);

// Update business hours
router.put(
  '/business-hours',
  validateBusinessHours,
  restaurantController.updateBusinessHours
);

// Update delivery settings
router.put(
  '/delivery-settings',
  validateDeliverySettings,
  restaurantController.updateDeliverySettings
);

// Toggle restaurant open/closed status
router.patch(
  '/toggle-status',
  restaurantController.toggleRestaurantStatus
);

// Delete restaurant
router.delete(
  '/',
  restaurantController.deleteRestaurant
);

module.exports = router;