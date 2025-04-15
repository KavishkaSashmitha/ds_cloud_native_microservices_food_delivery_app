const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: { 
    type: String, 
    required: [true, 'Menu item name is required'] 
  },
  description: String,
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
    required: true
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  image: String,
  preparationTime: {
    type: Number,
    required: true,
    min: 0
  },
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fats: Number
  }
}, {
  timestamps: true
});

// Validation method
MenuItemSchema.methods.validate = function() {
  const errors = [];
  if (!this.name) errors.push('Menu item name is required');
  if (!this.price || this.price < 0) errors.push('Valid price is required');
  if (!this.preparationTime || this.preparationTime < 0) errors.push('Valid preparation time is required');
  return errors;
};

module.exports = mongoose.model('MenuItem', MenuItemSchema);
