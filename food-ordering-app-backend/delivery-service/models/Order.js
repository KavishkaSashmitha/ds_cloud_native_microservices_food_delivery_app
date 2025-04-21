const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customerId: { 
    type: String, 
    required: true 
  },
  restaurantId: { 
    type: String, 
    required: true 
  },
  deliveryLocation: {
    address: { 
      type: String, 
      required: true 
    },
    coordinates: {
      lat: { 
        type: Number 
      },
      lng: { 
        type: Number 
      }
    }
  },
  items: [{
    itemId: { 
      type: String 
    },
    name: { 
      type: String 
    },
    quantity: { 
      type: Number 
    },
    price: { 
      type: Number 
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'RECEIVED'
  },
  assignedDriver: {
    type: String,
    default: null
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index for faster lookups
orderSchema.index({ orderId: 1, status: 1 });

// Add a pre-save hook to update the 'updatedAt' field
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;