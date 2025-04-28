// addressRoutes.js
const express = require('express');
const addressController = require('../controllers/addressController');

const router = express.Router();

// Optional authentication middleware
// If you have authentication, uncomment this:
// const authMiddleware = require('../middleware/auth');
// router.use(authMiddleware);

router
  .route('/')
  .get(addressController.getAllAddresses)
  .post(addressController.createAddress);

router.get('/nearby', addressController.getAddressesNearby);

router
  .route('/:id')
  .get(addressController.getAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;