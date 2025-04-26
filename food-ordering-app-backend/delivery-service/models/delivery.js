const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  restaurantId: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  restaurantLocation: {
    type: locationSchema,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerLocation: {
    type: locationSchema,
    required: true
  },
  deliveryPersonId: {
    type: String,
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  pickedUpAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  estimatedDeliveryTime: {
    type: Number,  // in minutes
    default: 30
  },
  distance: {
    type: Number,  // in km
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD', 'WALLET'],
    required: true
  },
  orderTotal: {
    type: Number,
    required: true
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  specialInstructions: {
    type: String,
    default: ''
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

// Index for geospatial queries
deliverySchema.index({ 'restaurantLocation.lat': 1, 'restaurantLocation.lng': 1 });

module.exports = mongoose.model('Delivery', deliverySchema);