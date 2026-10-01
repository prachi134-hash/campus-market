const express = require("express")

const router = express.Router()

const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController")

const authMiddleware = require("../middleware/authMiddleware")

router.post("/signup", signup)

router.post("/login", login)

router.get(
  "/profile",
  authMiddleware,
  getProfile
)

router.patch(
  "/profile",
  authMiddleware,
  updateProfile
)

router.patch(
  "/password",
  authMiddleware,
  changePassword
)

module.exports = router