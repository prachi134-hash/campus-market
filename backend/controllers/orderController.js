const Order = require("../models/Order")
const Product = require("../models/Product")

const populateOrder = async (order) => {
  await order.populate([
    {
      path: "buyer",
      select: "name email college",
    },
    {
      path: "items.product",
      select:
        "title price image category condition location status",
    },
    {
      path: "items.seller",
      select: "name email college",
    },
  ])

  return order
}

const updateOrderStatus = (order) => {
  const itemStatuses = order.items.map(
    (item) => item.status || "PENDING"
  )

  if (itemStatuses.length === 0) {
    order.status = "PENDING"
    return
  }

  if (
    itemStatuses.every(
      (status) => status === "CANCELLED"
    )
  ) {
    order.status = "CANCELLED"
    return
  }

  if (
    itemStatuses.every(
      (status) => status === "COMPLETED"
    )
  ) {
    order.status = "COMPLETED"
    return
  }

  if (
    itemStatuses.every(
      (status) =>
        status === "CONFIRMED" ||
        status === "COMPLETED" ||
        status === "CANCELLED"
    )
  ) {
    order.status = "CONFIRMED"
    return
  }

  order.status = "PENDING"
}

const recalculateOrderTotal = (order) => {
  order.totalAmount = order.items
    .filter(
      (item) =>
        (item.status || "PENDING") !== "CANCELLED"
    )
    .reduce(
      (total, item) =>
        total + item.priceAtPurchase,
      0
    )
}

const createOrder = async (req, res) => {
  try {
    const { items } = req.body
    const buyerId = req.user.userId

    if (!buyerId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      })
    }

    const productIds = items.map(
      (item) => item.productId
    )

    if (
      productIds.some(
        (productId) => !productId
      )
    ) {
      return res.status(400).json({
        message: "Invalid product in cart",
      })
    }

    const uniqueProductIds = [
      ...new Set(
        productIds.map((id) => id.toString())
      ),
    ]

    if (
      uniqueProductIds.length !==
      productIds.length
    ) {
      return res.status(400).json({
        message:
          "Duplicate products are not allowed in an order",
      })
    }

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    })

    if (
      products.length !==
      productIds.length
    ) {
      return res.status(400).json({
        message:
          "One or more products were not found",
      })
    }

    for (const product of products) {
      if (product.status !== "AVAILABLE") {
        return res.status(400).json({
          message:
            `${product.title} is no longer available`,
        })
      }

      if (
        product.seller.toString() ===
        buyerId
      ) {
        return res.status(400).json({
          message:
            `You cannot purchase your own product: ${product.title}`,
        })
      }
    }

    const orderItems = products.map(
      (product) => ({
        product: product._id,
        seller: product.seller,
        priceAtPurchase: product.price,
        meetupLocation: product.location,
        status: "PENDING",
      })
    )

    const totalAmount =
      orderItems.reduce(
        (total, item) =>
          total + item.priceAtPurchase,
        0
      )

    const reservedProductIds = []

    try {
      for (const productId of productIds) {
        const reservedProduct =
          await Product.findOneAndUpdate(
            {
              _id: productId,
              status: "AVAILABLE",
            },
            {
              $set: {
                status: "RESERVED",
              },
            },
            {
              new: true,
            }
          )

        if (!reservedProduct) {
          throw new Error(
            "One or more products are no longer available"
          )
        }

        reservedProductIds.push(productId)
      }

      const order = await Order.create({
        buyer: buyerId,
        items: orderItems,
        totalAmount,
        status: "PENDING",
      })

      await populateOrder(order)

      return res.status(201).json({
        message:
          "Order created successfully",
        order,
      })
    } catch (error) {
      if (reservedProductIds.length > 0) {
        await Product.updateMany(
          {
            _id: {
              $in: reservedProductIds,
            },
            status: "RESERVED",
          },
          {
            $set: {
              status: "AVAILABLE",
            },
          }
        )
      }

      if (
        error.message ===
        "One or more products are no longer available"
      ) {
        return res.status(409).json({
          message: error.message,
        })
      }

      throw error
    }
  } catch (error) {
    console.error(
      "Create order error:",
      error
    )

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create order",
    })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const buyerId = req.user.userId

    if (!buyerId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    const orders = await Order.find({
      buyer: buyerId,
    })
      .populate(
        "buyer",
        "name email college"
      )
      .populate(
        "items.product",
        "title price image category condition location status"
      )
      .populate(
        "items.seller",
        "name email college"
      )
      .sort({
        createdAt: -1,
      })

    return res.status(200).json(orders)
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to fetch orders",
    })
  }
}

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId

    if (!sellerId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    const orders = await Order.find({
      "items.seller": sellerId,
    })
      .populate(
        "buyer",
        "name email college"
      )
      .populate(
        "items.product",
        "title price image category condition location status"
      )
      .populate(
        "items.seller",
        "name email college"
      )
      .sort({
        createdAt: -1,
      })

    const sellerOrders = orders
      .map((order) => {
        const sellerItems =
          order.items
            .filter(
              (item) =>
                item.seller &&
                item.seller._id.toString() ===
                  sellerId
            )
            .map((item) => {
              if (!item.status) {
                item.status = "PENDING"
              }

              return item
            })

        return {
          ...order.toObject(),
          items: sellerItems,
        }
      })
      .filter(
        (order) =>
          order.items.length > 0
      )

    return res.status(200).json(
      sellerOrders
    )
  } catch (error) {
    console.error(
      "Get seller orders error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to fetch seller orders",
    })
  }
}

const confirmOrderItem = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      itemId,
    } = req.params

    const sellerId = req.user.userId

    if (!sellerId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    const order =
      await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    const item =
      order.items.id(itemId)

    if (!item) {
      return res.status(404).json({
        message:
          "Order item not found",
      })
    }

    if (
      item.seller.toString() !==
      sellerId
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to confirm this order item",
      })
    }

    const currentStatus =
      item.status || "PENDING"

    if (currentStatus !== "PENDING") {
      return res.status(400).json({
        message:
          "Only pending orders can be confirmed",
      })
    }

    const product =
      await Product.findById(
        item.product
      )

    if (!product) {
      return res.status(404).json({
        message:
          "Product associated with this order was not found",
      })
    }

    if (product.status !== "RESERVED") {
      return res.status(400).json({
        message:
          "Product is not currently reserved",
      })
    }

    item.status = "CONFIRMED"

    updateOrderStatus(order)

    await order.save()

    await populateOrder(order)

    return res.status(200).json({
      message:
        "Order confirmed successfully",
      order,
    })
  } catch (error) {
    console.error(
      "Confirm order item error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to confirm order",
    })
  }
}

const completeOrderItem = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      itemId,
    } = req.params

    const sellerId = req.user.userId

    if (!sellerId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    const order =
      await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    const item =
      order.items.id(itemId)

    if (!item) {
      return res.status(404).json({
        message:
          "Order item not found",
      })
    }

    if (
      item.seller.toString() !==
      sellerId
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to complete this order item",
      })
    }

    const currentStatus =
      item.status || "PENDING"

    if (currentStatus !== "CONFIRMED") {
      return res.status(400).json({
        message:
          "Only confirmed orders can be completed",
      })
    }

    if (
      order.payment?.status !== "PAID"
    ) {
      return res.status(400).json({
        message:
          "The buyer must complete payment before this order can be completed",
      })
    }

    const product =
      await Product.findById(
        item.product
      )

    if (!product) {
      return res.status(404).json({
        message:
          "Product associated with this order was not found",
      })
    }

    if (product.status !== "RESERVED") {
      return res.status(400).json({
        message:
          "Product is not currently reserved",
      })
    }

    item.status = "COMPLETED"

    updateOrderStatus(order)

    product.status = "SOLD"

    await product.save()

    await order.save()

    await populateOrder(order)

    return res.status(200).json({
      message:
        "Order completed successfully",
      order,
    })
  } catch (error) {
    console.error(
      "Complete order item error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to complete order",
    })
  }
}

const cancelOrderItem = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      itemId,
    } = req.params

    const sellerId = req.user.userId

    if (!sellerId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    const order =
      await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    const item =
      order.items.id(itemId)

    if (!item) {
      return res.status(404).json({
        message:
          "Order item not found",
      })
    }

    if (
      item.seller.toString() !==
      sellerId
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to cancel this order item",
      })
    }

    const currentStatus =
      item.status || "PENDING"

    if (currentStatus === "COMPLETED") {
      return res.status(400).json({
        message:
          "Completed orders cannot be cancelled",
      })
    }

    if (currentStatus === "CANCELLED") {
      return res.status(400).json({
        message:
          "Order item is already cancelled",
      })
    }

    if (
      order.payment?.status === "PAID"
    ) {
      return res.status(400).json({
        message:
          "A paid order cannot be cancelled",
      })
    }

    const product =
      await Product.findById(
        item.product
      )

    if (!product) {
      return res.status(404).json({
        message:
          "Product associated with this order was not found",
      })
    }

    if (product.status === "SOLD") {
      return res.status(400).json({
        message:
          "A sold product cannot be cancelled",
      })
    }

    item.status = "CANCELLED"

    product.status = "AVAILABLE"

    await product.save()

    recalculateOrderTotal(order)
    updateOrderStatus(order)

    await order.save()

    await populateOrder(order)

    return res.status(200).json({
      message:
        "Order cancelled successfully",
      order,
    })
  } catch (error) {
    console.error(
      "Cancel seller order item error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to cancel order",
    })
  }
}

const getOrderById = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId

    if (!userId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "buyer",
          "name email college"
        )
        .populate(
          "items.product",
          "title price image category condition location status"
        )
        .populate(
          "items.seller",
          "name email college"
        )

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    const isBuyer =
      order.buyer &&
      order.buyer._id.toString() ===
        userId

    const isSeller =
      order.items.some(
        (item) =>
          item.seller &&
          item.seller._id.toString() ===
            userId
      )

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        message:
          "You are not allowed to view this order",
      })
    }

    return res.status(200).json(order)
  } catch (error) {
    console.error(
      "Get order error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to fetch order",
    })
  }
}

const cancelOrder = async (
  req,
  res
) => {
  try {
    const buyerId = req.user.userId

    if (!buyerId) {
      return res.status(401).json({
        message: "User authentication required",
      })
    }

    const order =
      await Order.findById(
        req.params.id
      )

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    if (
      order.buyer.toString() !==
      buyerId
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to cancel this order",
      })
    }

    const hasNonPendingItem =
      order.items.some(
        (item) =>
          (item.status || "PENDING") !==
          "PENDING"
      )

    if (hasNonPendingItem) {
      return res.status(400).json({
        message:
          "Only pending orders can be cancelled by the buyer",
      })
    }

    if (
      order.payment?.status === "PAID"
    ) {
      return res.status(400).json({
        message:
          "A paid order cannot be cancelled",
      })
    }

    for (const item of order.items) {
      item.status = "CANCELLED"

      const product =
        await Product.findById(
          item.product
        )

      if (product) {
        if (product.status === "RESERVED") {
          product.status = "AVAILABLE"
          await product.save()
        }
      }
    }

    recalculateOrderTotal(order)
    updateOrderStatus(order)

    await order.save()

    await populateOrder(order)

    return res.status(200).json({
      message:
        "Order cancelled successfully",
      order,
    })
  } catch (error) {
    console.error(
      "Cancel order error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to cancel order",
    })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getSellerOrders,
  confirmOrderItem,
  completeOrderItem,
  cancelOrderItem,
  getOrderById,
  cancelOrder,
}