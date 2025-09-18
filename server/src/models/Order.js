import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user role = "user"
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user role = "driver"
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    dropoffAddress: {
      type: String,
      required: true,
    },
    packageDetails: {
      type: String, // e.g. "Documents", "Electronics"
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending", // booked by user, waiting for driver
        "accepted", // driver accepted
        "in_progress", // pickup done, on the way
        "delivered", // order completed
        "cancelled", // cancelled by user/admin
      ],
      default: "pending",
    },
    tracking: [
      {
        status: String, // e.g. "Order Accepted", "Reached Pickup", etc.
        location: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
