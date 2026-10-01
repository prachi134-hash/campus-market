const express = require("express")
const cors = require("cors")

const app = express()

const PORT = 5000

const connectDB = require("./config/db")

app.use(cors())
app.use(express.json())

connectDB()

const productRoutes = require("./routes/productRoutes")
const authRoutes = require("./routes/authRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

app.get("/", (req, res) => {
res.send("Campus Market API is running")
})

app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)

app.get("/api/orders/test-route", (req, res) => {
res.json({
message: "NEW ORDER ROUTES ARE LOADED",
})
})

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`)
})
