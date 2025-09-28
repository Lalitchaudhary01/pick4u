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
        "pending", // customer created order
        "assigned", // admin/auto assigned driver
        "accepted", // driver accepted
        "rejected", // driver rejected
        "picked", // driver picked package
        "in-transit", // driver on way
        "delivered", // order completed
        "cancelled", // customer/admin cancelled
      ],
      default: "pending",
    },

    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    couponCode: { type: String },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // ---------------- Real-time Tracking ----------------
    driverLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

// Create geospatial index for driverLocation
orderSchema.index({ driverLocation: "2dsphere" });

export default mongoose.model("Order", orderSchema);
