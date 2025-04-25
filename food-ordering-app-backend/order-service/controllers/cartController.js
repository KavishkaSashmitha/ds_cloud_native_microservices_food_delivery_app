// controllers/cartController.js
const mongoose = require("mongoose");
const Cart = require("../models/cartModel");

// Get all cart items for a user
exports.getCart = async (req, res) => {
  const userId = req.params.userId;

  try {
    const cartItems = await Cart.find({ userId });
    res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving cart", error });
  }
};

// Add an item to the cart
exports.addToCart = async (req, res) => {
    try {
      const { userId, productId, name, image, price, quantity } = req.body;
  
      // Check if the user already has a cart
      let cart = await Cart.findOne({ userId });
  
      // If no cart exists, create a new one
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      // Check if the item already exists in the cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // If item exists, update quantity
        cart.items[existingItemIndex].quantity = quantity;
      } else {
        // If item does not exist, add a new item to the cart
        cart.items.push({ productId, name, image, price, quantity });
      }
  
      // Save the cart with the updated items
      await cart.save();
  
      return res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: cart,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error adding item to cart',
        error: error.message,
      });
    }
  };


// Update quantity of a cart item
exports.updateCartItem = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOneAndUpdate(
        {
            userId: objectUserId,
            "items.productId": productId
          },
          {
            $set: { "items.$.quantity": quantity }
          },
          { new: true }
        );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.status(200).json({ success: true, message: "Quantity updated", data: cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Error updating cart item", error: error.message || error });
  }
};

// Delete a cart item
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOneAndUpdate(
      { userId: objectUserId },
      {
        $pull: {
          items: { productId: productId }
        }
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Error removing item",
      error: error.message || error
    });
  }
};
