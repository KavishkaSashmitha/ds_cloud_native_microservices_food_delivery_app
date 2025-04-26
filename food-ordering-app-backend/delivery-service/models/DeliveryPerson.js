const mongoose = require('mongoose');

const deliveryPersonSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentLocation: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    status: { 
      type: String, 
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'OFFLINE'
    },
    vehicleType: { type: String, enum: ['BIKE', 'CAR', 'SCOOTER'] },
    currentDeliveryId: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    completedDeliveries: { type: Number, default: 0 }
});
  
deliveryPersonSchema.index({ currentLocation: '2dsphere' });

const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema);

module.exports = DeliveryPerson;