const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    items: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        // required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Cash on Delivery", "Card"],
        // required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Preparing", "On the way", "Delivered", "Cancelled"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema, "order");
