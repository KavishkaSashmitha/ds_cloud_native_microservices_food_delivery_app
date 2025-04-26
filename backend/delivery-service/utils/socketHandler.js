const logger = require("./logger")
const jwt = require("jsonwebtoken")
const DeliveryPersonnel = require("../models/DeliveryPersonnel")

module.exports = (io) => {
  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error("Authentication token is required"))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.user = decoded
      next()
    } catch (error) {
      logger.error(`Socket authentication error: ${error.message}`)
      next(new Error("Invalid or expired token"))
    }
  })

  // Handle socket connections
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.user.id}, role: ${socket.user.role}`)

    // Join room based on user role and ID
    socket.join(`${socket.user.role}_${socket.user.id}`)

    // Handle location updates from delivery personnel
    socket.on("location_update", async (data) => {
      try {
        if (socket.user.role !== "delivery") {
          throw new Error("Only delivery personnel can update location")
        }

        const { latitude, longitude } = data

        // Update location in database
        await DeliveryPersonnel.findOneAndUpdate(
          { userId: socket.user.id },
          {
            currentLocation: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            lastLocationUpdateTime: new Date(),
          },
        )

        // Broadcast to relevant parties (restaurant, customer, admin)
        if (data.orderId) {
          io.to(`order_${data.orderId}`).emit("delivery_location_update", {
            orderId: data.orderId,
            location: { latitude, longitude },
            deliveryPersonnelId: socket.user.id,
          })
        }

        logger.info(`Location updated for delivery personnel ${socket.user.id}`)
      } catch (error) {
        logger.error(`Location update error: ${error.message}`)
        socket.emit("error", { message: error.message })
      }
    })

    // Handle delivery status updates
    socket.on("delivery_status_update", async (data) => {
      try {
        if (socket.user.role !== "delivery") {
          throw new Error("Only delivery personnel can update delivery status")
        }

        const { orderId, status } = data

        // Broadcast to relevant parties
        io.to(`order_${orderId}`).emit("delivery_status_update", {
          orderId,
          status,
          deliveryPersonnelId: socket.user.id,
          timestamp: new Date(),
        })

        logger.info(`Delivery status updated for order ${orderId}: ${status}`)
      } catch (error) {
        logger.error(`Delivery status update error: ${error.message}`)
        socket.emit("error", { message: error.message })
      }
    })

    // Join order room (for tracking specific orders)
    socket.on("join_order", (orderId) => {
      socket.join(`order_${orderId}`)
      logger.info(`User ${socket.user.id} joined order room: ${orderId}`)
    })

    // Leave order room
    socket.on("leave_order", (orderId) => {
      socket.leave(`order_${orderId}`)
      logger.info(`User ${socket.user.id} left order room: ${orderId}`)
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.user.id}`)
    })
  })
}
