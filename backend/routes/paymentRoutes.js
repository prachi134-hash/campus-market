const express = require("express")

const router = express.Router()

const {
mockPayment,
} = require("../controllers/paymentController")

const authMiddleware = require("../middleware/authMiddleware")

router.post(
"/mock",
authMiddleware,
mockPayment
)

module.exports = router
