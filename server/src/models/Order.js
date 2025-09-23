import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupAddress: { type: String, required: true },
    dropAddress: { type: String, required: true },
    packageWeight: { type: Number, required: true },
    deliveryType: {
      type: String,
      enum: ["instant", "same-day", "standard"],
      default: "standard",
    },
    fare: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "picked",
        "in-transit",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    couponCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
