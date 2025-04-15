const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  address: { 
    type: String, 
    required: [true, 'Restaurant address is required']
  },
  cuisine: { 
    type: String, 
    enum: ['Italian', 'Chinese', 'Indian', 'Fast Food', 'Vegetarian', 'Other']
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  operatingHours: {
    open: String,
    close: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  deliveryRadius: {
    type: Number,
    required: true,
    default: 5 // in kilometers
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for location-based queries
RestaurantSchema.index({ location: '2dsphere' });

// Virtual to calculate total menu items
RestaurantSchema.virtual('totalMenuItems').get(function() {
  return this.menuItems ? this.menuItems.length : 0;
});

// Method to calculate average rating
RestaurantSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
};

// Pre-save middleware to update average rating
RestaurantSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.averageRating = this.calculateAverageRating();
  }
  next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
