const express = require("express")

const router = express.Router()

const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController")

const authMiddleware = require("../middleware/authMiddleware")

// Get current user's cart
router.get(
  "/",
  authMiddleware,
  getCart
)

// Add product to cart
router.post(
  "/",
  authMiddleware,
  addToCart
)

// Remove product from cart
router.delete(
  "/:productId",
  authMiddleware,
  removeFromCart
)

module.exports = router