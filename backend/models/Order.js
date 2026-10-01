const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema(
{
product: {
type: mongoose.Schema.Types.ObjectId,
ref: "Product",
required: true,
},


seller: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

priceAtPurchase: {
  type: Number,
  required: true,
},

meetupLocation: {
  type: String,
  required: true,
},

status: {
  type: String,
  enum: [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ],
  default: "PENDING",
},


}
)

const orderSchema = new mongoose.Schema(
{
buyer: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},


items: [orderItemSchema],

totalAmount: {
  type: Number,
  required: true,
},

payment: {
  status: {
    type: String,
    enum: [
      "PENDING",
      "PAID",
      "FAILED",
    ],
    default: "PENDING",
  },

  method: {
    type: String,
    enum: ["MOCK"],
    default: "MOCK",
  },

  transactionId: {
    type: String,
    default: null,
  },

  paidAt: {
    type: Date,
    default: null,
  },
},

status: {
  type: String,
  enum: [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ],
  default: "PENDING",
},


},
{
timestamps: true,
}
)

const Order = mongoose.model("Order", orderSchema)

module.exports = Order


