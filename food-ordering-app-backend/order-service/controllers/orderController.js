const Order = require("../models/orderModel");

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress } = req.body;

        const order = new Order({
            user: req.user,
            items,
            totalAmount,
            deliveryAddress
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// Get orders for the logged-in user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

//  Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: "Order not found" });

        order.status = status || order.status;
        await order.save();

        res.status(200).json({ msg: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: "Order not found" });

        await order.deleteOne();
        res.status(200).json({ msg: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
