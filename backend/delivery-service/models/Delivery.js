const mongoose = require("mongoose")

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  deliveryPersonnelId: {
    type: String,
    ref: "DeliveryPersonnel",
  },
  restaurantId: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  restaurantLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  restaurantAddress: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  customerAddress: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "picked_up", "in_transit", "delivered", "cancelled"],
    default: "pending",
  },
  distance: {
    type: Number, // in kilometers
    required: true,
  },
  estimatedDeliveryTime: {
    type: Number, // in minutes
    required: true,
  },
  actualDeliveryTime: {
    type: Number, // in minutes
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  driverEarnings: {
    type: Number,
    required: true,
  },
  assignedAt: {
    type: Date,
  },
  pickedUpAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for common queries
deliverySchema.index({ deliveryPersonnelId: 1 })
deliverySchema.index({ status: 1 })
deliverySchema.index({ restaurantId: 1 })
deliverySchema.index({ customerId: 1 })

const Delivery = mongoose.model("Delivery", deliverySchema)

module.exports = Delivery
