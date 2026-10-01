
const Wishlist = require("../models/Wishlist")
const Product = require("../models/Product")

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user.userId,
    }).populate({
      path: "products",
      match: {
        status: "AVAILABLE",
      },
      populate: {
        path: "seller",
        select: "name email college course year",
      },
    })

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.userId,
        products: [],
      })
    }

    res.json(wishlist)
  } catch (error) {
    console.error("Get wishlist error:", error)

    res.status(500).json({
      message: "Failed to fetch wishlist",
    })
  }
}

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    if (product.status !== "AVAILABLE") {
      return res.status(400).json({
        message: "This product is no longer available",
      })
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.userId,
    })

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.userId,
        products: [productId],
      })
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      )

      if (alreadyExists) {
        return res.status(400).json({
          message: "Product is already in your wishlist",
        })
      }

      wishlist.products.push(productId)

      await wishlist.save()
    }

    const updatedWishlist = await wishlist.populate({
      path: "products",
      match: {
        status: "AVAILABLE",
      },
      populate: {
        path: "seller",
        select: "name email college course year",
      },
    })

    res.json({
      message: "Product added to wishlist",
      wishlist: updatedWishlist,
    })
  } catch (error) {
    console.error("Add wishlist error:", error)

    res.status(500).json({
      message: "Failed to add product to wishlist",
    })
  }
}

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    })

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      })
    }

    const productExists = wishlist.products.some(
      (id) => id.toString() === productId
    )

    if (!productExists) {
      return res.status(404).json({
        message: "Product is not in your wishlist",
      })
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    )

    await wishlist.save()

    const updatedWishlist = await wishlist.populate({
      path: "products",
      match: {
        status: "AVAILABLE",
      },
      populate: {
        path: "seller",
        select: "name email college course year",
      },
    })

    res.json({
      message: "Product removed from wishlist",
      wishlist: updatedWishlist,
    })
  } catch (error) {
    console.error("Remove wishlist error:", error)

    res.status(500).json({
      message: "Failed to remove product from wishlist",
    })
  }
}

const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    })

    if (!wishlist) {
      return res.json({
        inWishlist: false,
      })
    }

    const product = await Product.findById(productId)

    if (!product || product.status !== "AVAILABLE") {
      return res.json({
        inWishlist: false,
      })
    }

    const inWishlist = wishlist.products.some(
      (id) => id.toString() === productId
    )

    res.json({
      inWishlist,
    })
  } catch (error) {
    console.error("Check wishlist error:", error)

    res.status(500).json({
      message: "Failed to check wishlist",
    })
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
}



