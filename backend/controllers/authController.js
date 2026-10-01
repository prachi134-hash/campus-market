
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      course,
      year,
    } = req.body

    if (
      !name ||
      !email ||
      !password ||
      !college ||
      !course ||
      !year
    ) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      course,
      year,
    })

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)

    res.status(500).json({
      message: "Failed to create account",
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
      },
    })
  } catch (error) {
    console.error("Login error:", error)

    res.status(500).json({
      message: "Failed to login",
    })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      course: user.course,
      year: user.year,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Get profile error:", error)

    res.status(500).json({
      message: "Failed to fetch profile",
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      college,
      course,
      year,
    } = req.body

    const user = await User.findById(
      req.user.userId
    )

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    if (
      email &&
      email.toLowerCase() !== user.email
    ) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      })

      if (existingUser) {
        return res.status(400).json({
          message:
            "An account with this email already exists",
        })
      }

      user.email = email.toLowerCase()
    }

    if (name !== undefined) {
      user.name = name
    }

    if (college !== undefined) {
      user.college = college
    }

    if (course !== undefined) {
      user.course = course
    }

    if (year !== undefined) {
      user.year = year
    }

    await user.save()

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
      },
    })
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    )

    res.status(500).json({
      message: "Failed to update profile",
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      })
    }

    const user = await User.findById(
      req.user.userId
    )

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if (!passwordMatch) {
      return res.status(400).json({
        message:
          "Current password is incorrect",
      })
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    )

    await user.save()

    res.json({
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error(
      "Change password error:",
      error
    )

    res.status(500).json({
      message: "Failed to update password",
    })
  }
}

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
}

