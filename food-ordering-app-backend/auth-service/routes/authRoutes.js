// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authControllers');
const { authenticateToken } = require('../middleware/auth');
const { 
  registerValidationRules, 
  loginValidationRules, 
  validateRequest 
} = require('../middleware/validate');

const router = express.Router();

// Public routes
router.post(
  '/register', 
  registerValidationRules, 
  validateRequest, 
  authController.register
);

router.post(
  '/login', 
  loginValidationRules, 
  validateRequest, 
  authController.login
);

router.post('/refresh-token', authController.refresh);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;