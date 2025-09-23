// src/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pickupAddress: { type: String, required: true },
  dropAddress: { type: String, required: true },
  package: {
    weight: { type: Number, required: true },
    dimensions: { type: String },
    type: { type: String }, // e.g. Documents, Electronics, Fragile
  },
  deliveryType: {
    type: String,
    enum: ["instant", "same-day", "standard"],
    required: true,
  },
  fare: { type: Number, required: true },
  coupon: { type: String },
  status: {
    type: String,
    enum: [
      "pending",
      "assigned",
      "picked_up",
      "in_transit",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  meta: {
    eta: { type: Date }, // optional estimated delivery time
    distanceKm: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order; // ✅ ES Module default export
