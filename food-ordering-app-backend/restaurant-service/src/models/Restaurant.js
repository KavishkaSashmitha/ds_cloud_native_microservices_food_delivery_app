const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    minlength: [3, 'Restaurant name must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    }
  },
  businessHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  }],
  deliverySettings: {
    deliveryFee: {
      type: Number,
      default: 0
    },
    minimumOrder: {
      type: Number,
      default: 0
    },
    deliveryRadius: {
      type: Number,
      default: 5
    },
    preparationTime: {
      type: String,
      default: '15-30'
    }
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Restaurant', restaurantSchema);