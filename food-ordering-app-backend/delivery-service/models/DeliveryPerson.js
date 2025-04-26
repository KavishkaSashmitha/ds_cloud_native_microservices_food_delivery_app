const mongoose = require('mongoose');

const deliveryPersonSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  vehicleType: {
    type: String,
    enum: ['BIKE', 'CAR', 'SCOOTER', 'BICYCLE'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  currentLocation: {
    lat: {
      type: Number,
      default: null
    },
    lng: {
      type: Number,
      default: null
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  completedDeliveries: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPerson', deliveryPersonSchema);