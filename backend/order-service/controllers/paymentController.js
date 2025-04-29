const { validationResult } = require("express-validator")
const Order = require("../models/Order")
const Payment = require("../models/Payment")
const logger = require("../utils/logger")
require("dotenv").config();
const Stripe = require("stripe");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Process payment using Stripe Checkout
exports.processPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.id !== order.customerId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to process payment for this order" });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${order._id}`,
            },
            unit_amount: Math.round(order.total * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        orderId: order._id.toString(),
        customerId: order.customerId.toString(),
      },
    });

    // Save initial payment record with status 'pending'
    const payment = new Payment({
      orderId,
      customerId: order.customerId,
      amount: order.total,
      method: "cash",
      status: "pending",
      transactionId: session.id,
      paymentGateway: "stripe",
    });

    await payment.save();

    res.status(200).json({
      message: "Stripe Checkout session created",
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    logger.error(`Process payment error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (req.user.role !== "admin" && req.user.id !== payment.customerId.toString()) {
      return res.status(403).json({ message: "Not authorized to view this payment" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    logger.error(`Get payment error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get payments by customer ID
exports.getPaymentsByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.user.id;
    const { page = 1, limit = 10 } = req.query;

    if (req.user.role !== "admin" && req.user.id !== customerId) {
      return res.status(403).json({ message: "Not authorized to view these payments" });
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    const payments = await Payment.find({ customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit));

    const total = await Payment.countDocuments({ customerId });

    res.status(200).json({
      payments,
      pagination: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error(`Get customer payments error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ message: "Only completed payments can be refunded" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to process refunds" });
    }

    const refundAmount = Number.parseFloat(amount);
    if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > payment.amount) {
      return res.status(400).json({ message: "Invalid refund amount" });
    }

    // Stripe refund (optional - use real Stripe API if needed)
    // await stripe.refunds.create({ payment_intent: payment.transactionId, amount: refundAmount * 100 });

    payment.status = "refunded";
    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    payment.refundTransactionId = `ref_${Date.now()}`;
    payment.updatedAt = Date.now();

    await payment.save();

    const order = await Order.findById(payment.orderId);
    if (order) {
      order.paymentStatus = "refunded";
      order.refundAmount = refundAmount;
      order.refundReason = reason;
      order.updatedAt = Date.now();
      await order.save();
    }

    res.status(200).json({
      message: "Refund processed successfully",
      payment,
    });
  } catch (error) {
    logger.error(`Process refund error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get payment statistics
exports.getPaymentStatistics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this resource" });
    }

    const totalPayments = await Payment.countDocuments();

    const paymentsByStatus = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const paymentsByMethod = await Payment.aggregate([
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const paymentsByDay = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      totalPayments,
      paymentsByStatus: paymentsByStatus.reduce((acc, curr) => {
        acc[curr._id] = { count: curr.count, total: curr.total };
        return acc;
      }, {}),
      paymentsByMethod: paymentsByMethod.reduce((acc, curr) => {
        acc[curr._id] = { count: curr.count, total: curr.total };
        return acc;
      }, {}),
      paymentsByDay,
    });
  } catch (error) {
    logger.error(`Get payment statistics error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};