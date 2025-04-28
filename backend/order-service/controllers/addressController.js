// addressController.js
const Address = require('../models/Address');

// Simple error handling middleware
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: err.message || 'An error occurred'
      });
    });
  };
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  }
}

exports.getAllAddresses = catchAsync(async (req, res, next) => {
  // Assuming authentication adds user to req
  const userId = req.user ? req.user.id : null;
  
  const addresses = await Address.find(userId ? { user: userId } : {});

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: {
      addresses
    }
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const query = { _id: req.params.id };
  
  // Add user filter if authenticated
  if (req.user) {
    query.user = req.user.id;
  }
  
  const address = await Address.findOne(query);

  if (!address) {
    return res.status(404).json({
      status: 'fail',
      message: 'No address found with that ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});

exports.createAddress = async (req, res, next) => {
    try {
      // Auto-assign user from req.user if not provided
      if (!req.body.user && req.user) {
        req.body.user = req.user.id;
      }
  
      // Format coordinates if latitude and longitude are sent
      if (req.body.latitude && req.body.longitude) {
        req.body.coordinates = {
          type: 'Point',
          coordinates: [
            parseFloat(req.body.longitude),
            parseFloat(req.body.latitude),
          ],
        };
        // Clean up raw latitude/longitude fields
        delete req.body.latitude;
        delete req.body.longitude;
      }
  
      // Create address
      const newAddress = await Address.create(req.body);
  
      res.status(201).json({
        status: 'success',
        data: {
          address: newAddress,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  

exports.updateAddress = catchAsync(async (req, res, next) => {
  const addressData = { ...req.body };
  
  // Format the coordinates if provided
  if (req.body.latitude && req.body.longitude) {
    addressData.coordinates = {
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude)
    };
    
    // Remove the individual fields
    delete addressData.latitude;
    delete addressData.longitude;
  }

  const query = { _id: req.params.id };
  
  // Add user filter if authenticated
  if (req.user) {
    query.user = req.user.id;
  }

  const address = await Address.findOneAndUpdate(
    query,
    addressData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!address) {
    return res.status(404).json({
      status: 'fail',
      message: 'No address found with that ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const query = { _id: req.params.id };
  
  // Add user filter if authenticated
  if (req.user) {
    query.user = req.user.id;
  }

  const address = await Address.findOneAndDelete(query);

  if (!address) {
    return res.status(404).json({
      status: 'fail',
      message: 'No address found with that ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Find addresses near a specific location
exports.getAddressesNearby = catchAsync(async (req, res, next) => {
  const { latitude, longitude, distance = 10000 } = req.query; // distance in meters

  if (!latitude || !longitude) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide latitude and longitude'
    });
  }

  const query = {
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(distance)
      }
    }
  };

  // Add user filter if authenticated
  if (req.user) {
    query.user = req.user.id;
  }

  const addresses = await Address.find(query);

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: {
      addresses
    }
  });
});