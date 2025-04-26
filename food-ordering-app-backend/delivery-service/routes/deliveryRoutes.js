const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Health check (non-authenticated)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delivery service is healthy'
  });
});


// Profile management
router.get('/profile', deliveryController.getDeliveryProfile);
router.put('/profile', deliveryController.updateDeliveryProfile);
router.put('/status', deliveryController.updateAvailabilityStatus);

// Available deliveries
router.get('/available', deliveryController.getAvailableDeliveries);
router.get('/available/nearby', deliveryController.getNearbyDeliveries);
router.post('/available/:deliveryId/accept', deliveryController.acceptDelivery);

// Active deliveries
router.get('/active', deliveryController.getActiveDeliveries);
router.put('/active/:deliveryId/status', deliveryController.updateDeliveryStatus);
router.post('/active/:deliveryId/complete', deliveryController.completeDelivery);

// Delivery history
router.get('/history', deliveryController.getDeliveryHistory);
router.get('/history/stats', deliveryController.getDeliveryStats);
router.get('/earnings', deliveryController.getEarningsReport);

// Location management
router.put('/location', deliveryController.updateCurrentLocation);
router.get('/route/:deliveryId', deliveryController.getDeliveryRoute);

// Debug route - only for development
if (process.env.NODE_ENV !== 'production') {
  router.post('/debug/verify-token', (req, res) => {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'QNH7W6d8UQHZmHh9jXPqr5V3YTsWeCF2';
    
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'No token provided' });
      }
      
      // Try to verify the token without throwing errors
      const decoded = jwt.decode(token);
      
      // Now try to verify
      try {
        const verified = jwt.verify(token, JWT_SECRET);
        return res.json({
          success: true,
          message: 'Token is valid',
          decoded: verified
        });
      } catch (verifyError) {
        return res.status(401).json({
          success: false,
          message: 'Token verification failed',
          error: verifyError.message,
          decoded: decoded // Still return the decoded info
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Debug endpoint error',
        error: error.message
      });
    }
  });
}

module.exports = router;