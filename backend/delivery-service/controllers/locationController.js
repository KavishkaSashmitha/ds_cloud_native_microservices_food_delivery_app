const { validationResult } = require("express-validator")
const DeliveryPersonnel = require("../models/DeliveryPersonnel")
const LocationHistory = require("../models/LocationHistory")
const Delivery = require("../models/Delivery")
const logger = require("../utils/logger")

// Update delivery personnel location
exports.updateLocation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { latitude, longitude, deliveryId } = req.body

    // Only delivery personnel can update their location
    if (req.user.role !== "delivery") {
      return res.status(403).json({ message: "Not authorized to update location" })
    }

    // Update delivery personnel location
    const deliveryPersonnel = await DeliveryPersonnel.findOneAndUpdate(
      { userId: req.user.id },
      {
        currentLocation: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        lastLocationUpdateTime: new Date(),
      },
      { new: true },
    )

    if (!deliveryPersonnel) {
      return res.status(404).json({ message: "Delivery personnel not found" })
    }

    // Save location history
    const locationHistory = new LocationHistory({
      deliveryPersonnelId: req.user.id,
      deliveryId: deliveryId || null,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    })

    await locationHistory.save()

    res.status(200).json({
      message: "Location updated successfully",
      location: {
        latitude,
        longitude,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    logger.error(`Update location error: ${error.message}`)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get delivery personnel current location
exports.getDeliveryPersonnelLocation = async (req, res) => {
  try {
    const { id } = req.params

    const deliveryPersonnel = await DeliveryPersonnel.findOne({ userId: id })
    if (!deliveryPersonnel) {
      return res.status(404).json({ message: "Delivery personnel not found" })
    }

    res.status(200).json({
      location: {
        latitude: deliveryPersonnel.currentLocation.coordinates[1],
        longitude: deliveryPersonnel.currentLocation.coordinates[0],
        lastUpdated: deliveryPersonnel.lastLocationUpdateTime,
      },
    })
  } catch (error) {
    logger.error(`Get delivery personnel location error: ${error.message}`)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get location history for a delivery
exports.getLocationHistory = async (req, res) => {
  try {
    const { deliveryId } = req.params
    const { startTime, endTime } = req.query

    // Verify the delivery exists
    const delivery = await Delivery.findById(deliveryId)
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" })
    }

    // Check authorization
    if (
      (req.user.role === "customer" && delivery.customerId !== req.user.id) ||
      (req.user.role === "restaurant" && delivery.restaurantId !== req.user.id) ||
      (req.user.role === "delivery" && delivery.deliveryPersonnelId !== req.user.id)
    ) {
      return res.status(403).json({ message: "Not authorized to access this delivery's location history" })
    }

    // Build query
    const query = { deliveryId }
    if (startTime || endTime) {
      query.timestamp = {}
      if (startTime) query.timestamp.$gte = new Date(startTime)
      if (endTime) query.timestamp.$lte = new Date(endTime)
    }

    // Get location history
    const locationHistory = await LocationHistory.find(query).sort({ timestamp: 1 })

    // Format response
    const formattedHistory = locationHistory.map((record) => ({
      latitude: record.location.coordinates[1],
      longitude: record.location.coordinates[0],
      timestamp: record.timestamp,
    }))

    res.status(200).json({ locationHistory: formattedHistory })
  } catch (error) {
    logger.error(`Get location history error: ${error.message}`)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get nearby delivery personnel
exports.getNearbyDeliveryPersonnel = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { latitude, longitude, maxDistance = 5 } = req.body

    // Only restaurant and admin users can access this endpoint
    if (req.user.role !== "restaurant" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this resource" })
    }

    // Find nearby delivery personnel
    const nearbyPersonnel = await DeliveryPersonnel.find({
      isAvailable: true,
      isActive: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance * 1000, // Convert km to meters
        },
      },
    }).select("userId name vehicleType currentLocation lastLocationUpdateTime rating")

    // Format response
    const formattedPersonnel = nearbyPersonnel.map((person) => ({
      id: person.userId,
      name: person.name,
      vehicleType: person.vehicleType,
      location: {
        latitude: person.currentLocation.coordinates[1],
        longitude: person.currentLocation.coordinates[0],
      },
      lastUpdated: person.lastLocationUpdateTime,
      rating: person.rating,
    }))

    res.status(200).json({
      count: formattedPersonnel.length,
      deliveryPersonnel: formattedPersonnel,
    })
  } catch (error) {
    logger.error(`Get nearby delivery personnel error: ${error.message}`)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = exports
