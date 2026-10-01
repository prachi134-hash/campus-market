const express = require("express")

const router = express.Router()

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlistController")

const authMiddleware = require("../middleware/authMiddleware")


// =====================================================
// GET MY WISHLIST
// =====================================================
router.get(
  "/",
  authMiddleware,
  getWishlist
)


// =====================================================
// ADD PRODUCT TO WISHLIST
// =====================================================
router.post(
  "/",
  authMiddleware,
  addToWishlist
)


// =====================================================
// CHECK PRODUCT IN WISHLIST
// =====================================================
router.get(
  "/check/:productId",
  authMiddleware,
  checkWishlist
)


// =====================================================
// REMOVE PRODUCT FROM WISHLIST
// =====================================================
router.delete(
  "/:productId",
  authMiddleware,
  removeFromWishlist
)


module.exports = router