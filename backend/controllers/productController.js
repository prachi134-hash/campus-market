const Product = require("../models/Product")

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      sort,
    } = req.query

    const filter = {
      status: "AVAILABLE",
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ]
    }

    if (category) {
      filter.category = category
    }

    if (condition) {
      filter.condition = condition
    }

    if (minPrice !== undefined) {
      const min = Number(minPrice)

      if (Number.isNaN(min)) {
        return res.status(400).json({
          message: "Invalid minimum price",
        })
      }

      filter.price = {
        ...filter.price,
        $gte: min,
      }
    }

    if (maxPrice !== undefined) {
      const max = Number(maxPrice)

      if (Number.isNaN(max)) {
        return res.status(400).json({
          message: "Invalid maximum price",
        })
      }

      filter.price = {
        ...filter.price,
        $lte: max,
      }
    }

    let sortOption = {
      createdAt: -1,
    }

    if (sort === "price_asc") {
      sortOption = {
        price: 1,
      }
    } else if (sort === "price_desc") {
      sortOption = {
        price: -1,
      }
    } else if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      }
    } else if (sort) {
      return res.status(400).json({
        message: "Invalid sort option",
      })
    }

    const products = await Product.find(filter)
      .populate(
        "seller",
        "name email college course year"
      )
      .sort(sortOption)

    res.json(products)
  } catch (error) {
    console.error("Get products error:", error)

    res.status(500).json({
      message: "Failed to fetch products",
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate(
        "seller",
        "name email college course year"
      )

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    res.json(product)
  } catch (error) {
    console.error("Get product error:", error)

    res.status(400).json({
      message: "Invalid product ID",
    })
  }
}

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user.userId,
    })

    const populatedProduct = await product.populate(
      "seller",
      "name email college course year"
    )

    res.status(201).json(populatedProduct)
  } catch (error) {
    console.error("Create product error:", error)

    res.status(400).json({
      message: error.message,
    })
  }
}

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.userId,
    })
      .populate(
        "seller",
        "name email college course year"
      )
      .sort({
        createdAt: -1,
      })

    res.json(products)
  } catch (error) {
    console.error("Get my listings error:", error)

    res.status(500).json({
      message: "Failed to fetch your listings",
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    if (
      product.seller.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only edit your own listings",
      })
    }

    if (product.status !== "AVAILABLE") {
      return res.status(400).json({
        message:
          "Only available listings can be edited",
      })
    }

    const allowedFields = [
      "title",
      "price",
      "category",
      "condition",
      "description",
      "location",
      "image",
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field]
      }
    })

    await product.save()

    const updatedProduct = await product.populate(
      "seller",
      "name email college course year"
    )

    res.json(updatedProduct)
  } catch (error) {
    console.error("Update product error:", error)

    res.status(400).json({
      message: error.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    if (
      product.seller.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own listings",
      })
    }

    if (product.status !== "AVAILABLE") {
      return res.status(400).json({
        message:
          "Only available listings can be deleted",
      })
    }

    await product.deleteOne()

    res.json({
      message: "Listing deleted successfully",
    })
  } catch (error) {
    console.error("Delete product error:", error)

    res.status(400).json({
      message: "Invalid product ID",
    })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
}