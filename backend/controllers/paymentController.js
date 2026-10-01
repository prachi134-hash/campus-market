const crypto = require("crypto")

const Order = require("../models/Order")

const mockPayment = async (req, res) => {
  try {
    const buyerId = req.user.userId

    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
      })
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    if (order.buyer.toString() !== buyerId) {
      return res.status(403).json({
        message:
          "You are not allowed to pay for this order",
      })
    }

    if (order.status === "CANCELLED") {
      return res.status(400).json({
        message: "Cancelled orders cannot be paid",
      })
    }

    if (order.status === "PENDING") {
      return res.status(400).json({
        message:
          "Seller must confirm the order before payment",
      })
    }

    if (order.status === "COMPLETED") {
      return res.status(400).json({
        message:
          "Completed orders cannot be paid",
      })
    }

    if (order.payment.status === "PAID") {
      return res.status(400).json({
        message: "Order is already paid",
      })
    }

    const payableItems = order.items.filter(
      (item) =>
        (item.status || "PENDING") !== "CANCELLED"
    )

    if (payableItems.length === 0) {
      return res.status(400).json({
        message:
          "There are no payable items in this order",
      })
    }

    const hasPendingItems = payableItems.some(
      (item) => item.status === "PENDING"
    )

    if (hasPendingItems) {
      return res.status(400).json({
        message:
          "All order items must be confirmed before payment",
      })
    }

    order.totalAmount = payableItems.reduce(
      (total, item) =>
        total + item.priceAtPurchase,
      0
    )

    const transactionId = `MOCK-${crypto
      .randomBytes(8)
      .toString("hex")
      .toUpperCase()}`

    order.payment.status = "PAID"
    order.payment.method = "MOCK"
    order.payment.transactionId = transactionId
    order.payment.paidAt = new Date()

    await order.save()

    return res.status(200).json({
      message: "Mock payment successful",
      payment: order.payment,
      orderId: order._id,
      totalAmount: order.totalAmount,
    })
  } catch (error) {
    console.error(
      "Mock payment error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to process mock payment",
    })
  }
}

module.exports = {
  mockPayment,
}