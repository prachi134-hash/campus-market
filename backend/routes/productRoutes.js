const express = require("express")

const router = express.Router()

const {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController")

const authMiddleware = require("../middleware/authMiddleware")

router.get("/", getProducts)

router.get("/my", authMiddleware, getMyProducts)

router.get("/:id", getProductById)

router.post("/", authMiddleware, createProduct)

router.put("/:id", authMiddleware, updateProduct)

router.delete("/:id", authMiddleware, deleteProduct)

module.exports = router