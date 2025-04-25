const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Middleware (assume you already have auth + isAdmin middlewares)
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Routes
router.post("/", protect, orderController.createOrder);
router.get("/my-orders", protect, orderController.getUserOrders);
router.get("/", protect, isAdmin, orderController.getAllOrders);
router.put("/:id/status", protect, isAdmin, orderController.updateOrderStatus);
router.delete("/:id", protect, isAdmin, orderController.deleteOrder);

module.exports = router;
