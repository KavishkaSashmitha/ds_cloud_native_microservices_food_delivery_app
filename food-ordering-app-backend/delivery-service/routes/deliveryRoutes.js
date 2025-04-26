const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

// Delivery Person endpoints
router.get('/profile', authMiddleware, deliveryController.getProfile);
router.put('/profile', authMiddleware, deliveryController.updateProfile);
router.put('/location', authMiddleware, validationMiddleware.validateLocation, deliveryController.updateLocation);
router.put('/status', authMiddleware, deliveryController.updateStatus);

// Order endpoints
router.get('/orders/nearby', authMiddleware, deliveryController.getNearbyOrders);
router.post('/orders/:orderId/accept', authMiddleware, deliveryController.acceptOrder);
router.patch('/orders/:orderId/pickup', authMiddleware, deliveryController.markAsPickedUp);
router.patch('/orders/:orderId/deliver', authMiddleware, deliveryController.markAsDelivered);
router.get('/orders/current', authMiddleware, deliveryController.getCurrentDelivery);
router.get('/orders/history', authMiddleware, deliveryController.getDeliveryHistory);

// Admin endpoints (if needed)
router.get('/admin/deliveries', authMiddleware.admin, deliveryController.getAllDeliveries);
router.get('/admin/metrics', authMiddleware.admin, deliveryController.getDeliveryMetrics);

module.exports = router;