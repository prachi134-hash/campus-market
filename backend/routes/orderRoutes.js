
const express = require("express")

const router = express.Router()

const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  confirmOrderItem,
  completeOrderItem,
  cancelOrderItem,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController")

const authMiddleware = require("../middleware/authMiddleware")


// --------------------------------------------------
// Create Order
// --------------------------------------------------

router.post(
  "/",
  authMiddleware,
  createOrder
)


// --------------------------------------------------
// Buyer: Get My Orders
// --------------------------------------------------

router.get(
  "/",
  authMiddleware,
  getMyOrders
)


// --------------------------------------------------
// Seller: Get Orders for My Products
// --------------------------------------------------

router.get(
  "/seller",
  authMiddleware,
  getSellerOrders
)


// --------------------------------------------------
// Seller: Confirm Individual Order Item
// --------------------------------------------------

router.patch(
  "/:orderId/items/:itemId/confirm",
  authMiddleware,
  confirmOrderItem
)


// --------------------------------------------------
// Seller: Complete Individual Order Item
// --------------------------------------------------

router.patch(
  "/:orderId/items/:itemId/complete",
  authMiddleware,
  completeOrderItem
)


// --------------------------------------------------
// Seller: Cancel Individual Order Item
// --------------------------------------------------

router.patch(
  "/:orderId/items/:itemId/cancel",
  authMiddleware,
  cancelOrderItem
)


// --------------------------------------------------
// Buyer: Cancel Entire Order
// --------------------------------------------------

router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
)


// --------------------------------------------------
// Get Single Order
// --------------------------------------------------

router.get(
  "/:id",
  authMiddleware,
  getOrderById
)


module.exports = router

