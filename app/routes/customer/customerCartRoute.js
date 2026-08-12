const express = require("express");

const router = express.Router();

const CustomerCartController = require("../../controllers/customer/CustomerCartController");

// View Cart
router.get("/cart", CustomerCartController.cart);

// Add To Cart
router.get("/cart/add/:id", CustomerCartController.addToCart);

// Update Quantity
router.post("/cart/update/:id", CustomerCartController.updateQuantity);

// Remove Item
router.get("/cart/remove/:id", CustomerCartController.removeItem);

// Clear Cart
router.get("/cart/clear", CustomerCartController.clearCart);

module.exports = router;