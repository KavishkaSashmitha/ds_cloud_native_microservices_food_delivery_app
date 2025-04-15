const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/search', restaurantController.searchRestaurants);

// Protected routes
router.post(
  '/restaurants', 
  authMiddleware.authenticate,
  authMiddleware.restrictTo('restaurant_admin'),
  restaurantController.createRestaurant
);

router.get(
  '/restaurants/:restaurantId',
  restaurantController.getRestaurantDetails
);

router.put(
  '/restaurants/:restaurantId',
  authMiddleware.authenticate,
  authMiddleware.restrictTo('restaurant_admin'),
  restaurantController.updateRestaurant
);

router.delete(
  '/restaurants/:restaurantId',
  authMiddleware.authenticate,
  authMiddleware.restrictTo('restaurant_admin'),
  restaurantController.deleteRestaurant
);

router.post(
  '/restaurants/:restaurantId/menu-items',
  authMiddleware.authenticate,
  authMiddleware.restrictTo('restaurant_admin'),
  restaurantController.addMenuItem
);

router.put(
  '/restaurants/:restaurantId/menu-items/:itemId',
  authMiddleware.authenticate,
  authMiddleware.restrictTo('restaurant_admin'),
  restaurantController.updateMenuItem
);

router.delete(
  '/restaurants/:restaurantId/menu-items/:itemId',
  authMiddleware.authenticate,
  authMiddleware.restrictTo('restaurant_admin'),
  restaurantController.deleteMenuItem
);

router.post(
  '/restaurants/:restaurantId/reviews',
  authMiddleware.authenticate,
  restaurantController.addReview
);

module.exports = router;
