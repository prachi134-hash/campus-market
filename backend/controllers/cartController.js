
const Cart = require("../models/Cart")
const Product = require("../models/Product")

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.userId,
    })

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [],
      })
    }

    cart.items = cart.items.filter(
      (item) => item.product
    )

    const productIds = cart.items.map(
      (item) => item.product
    )

    const availableProducts = await Product.find({
      _id: { $in: productIds },
      status: "AVAILABLE",
    }).populate({
      path: "seller",
      select: "name college",
    })

    const availableProductIds = new Set(
      availableProducts.map((product) =>
        product._id.toString()
      )
    )

    cart.items = cart.items.filter((item) =>
      availableProductIds.has(
        item.product.toString()
      )
    )

    await cart.save()

    const productMap = new Map(
      availableProducts.map((product) => [
        product._id.toString(),
        product,
      ])
    )

    const populatedItems = cart.items.map(
      (item) => ({
        product:
          productMap.get(
            item.product.toString()
          ),
      })
    )

    res.status(200).json({
      ...cart.toObject(),
      items: populatedItems,
    })
  } catch (error) {
    console.error("Get cart error:", error)

    res.status(500).json({
      message: "Failed to fetch cart",
    })
  }
}

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      })
    }

    const product = await Product.findById(
      productId
    )

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    if (product.status !== "AVAILABLE") {
      return res.status(400).json({
        message:
          "This product is no longer available",
      })
    }

    let cart = await Cart.findOne({
      user: req.user.userId,
    })

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            product: productId,
          },
        ],
      })
    } else {
      const alreadyInCart = cart.items.some(
        (item) =>
          item.product.toString() === productId
      )

      if (!alreadyInCart) {
        cart.items.push({
          product: productId,
        })

        await cart.save()
      }
    }

    const updatedCart = await Cart.findById(
      cart._id
    ).populate({
      path: "items.product",
      populate: {
        path: "seller",
        select: "name college",
      },
    })

    res.status(200).json(updatedCart)
  } catch (error) {
    console.error("Add to cart error:", error)

    res.status(500).json({
      message: "Failed to add product to cart",
    })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({
      user: req.user.userId,
    })

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      })
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId
    )

    await cart.save()

    const updatedCart = await Cart.findById(
      cart._id
    ).populate({
      path: "items.product",
      populate: {
        path: "seller",
        select: "name college",
      },
    })

    res.status(200).json(updatedCart)
  } catch (error) {
    console.error(
      "Remove from cart error:",
      error
    )

    res.status(500).json({
      message: "Failed to remove product from cart",
    })
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
}

