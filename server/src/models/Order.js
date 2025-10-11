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
        "pending", // created, waiting for driver
        "assigned", // admin assigned driver
        "accepted", // driver accepted
        "rejected", // driver rejected
        "arrived", // driver reached pickup
        "picked-up", // package picked
        "on-the-way", // en route to customer
        "delivered", // completed
        "cancelled", // cancelled by customer/admin
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

    // ✅ ADD THESE MISSING FIELDS FOR TRACKING
    arrivedAt: { type: Date },
    pickedUpAt: { type: Date },
    onTheWayAt: { type: Date },
    deliveredAt: { type: Date },
    acceptedAt: { type: Date },
    assignedAt: { type: Date },
    estimatedDelivery: { type: Date },

    // ✅ Additional useful fields
    proofPhoto: { type: String }, // Delivery proof image
    customerFeedback: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    orderId: { type: String, unique: true }, // Custom order ID like "ORD-12345"
    distance: { type: Number }, // Distance in km
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    urgent: { type: Boolean, default: false },

    // ✅ Cancellation details
    cancelledBy: {
      type: String,
      enum: ["customer", "driver", "admin"],
    },
    cancellationReason: { type: String },

    // ✅ Package details
    packageDescription: { type: String },
    packageValue: { type: Number }, // Declared value for insurance
    fragile: { type: Boolean, default: false },

    // ✅ Contact information
    customerPhone: { type: String },
    customerName: { type: String },
    customerEmail: { type: String },

    // ✅ Driver details (denormalized for performance)
    driverName: { type: String },
    driverPhone: { type: String },
    vehicleType: { type: String },
  },
  { timestamps: true }
);

// Create geospatial index for driverLocation
orderSchema.index({ driverLocation: "2dsphere" });

// ✅ Index for better query performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ assignedDriver: 1, status: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// ✅ Pre-save middleware to generate order ID
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `ORD-${(count + 1).toString().padStart(5, "0")}`;
  }
  next();
});

// ✅ Virtual for order duration
orderSchema.virtual("deliveryDuration").get(function () {
  if (this.deliveredAt && this.createdAt) {
    return this.deliveredAt - this.createdAt;
  }
  return null;
});

// ✅ Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  const nonCancellableStatuses = ["picked-up", "on-the-way", "delivered"];
  return !nonCancellableStatuses.includes(this.status);
};

// ✅ Method to update status with timestamp
orderSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;

  // Auto-set timestamps based on status
  const now = new Date();
  switch (newStatus) {
    case "accepted":
      this.acceptedAt = now;
      break;
    case "arrived":
      this.arrivedAt = now;
      break;
    case "picked-up":
      this.pickedUpAt = now;
      break;
    case "on-the-way":
      this.onTheWayAt = now;
      break;
    case "delivered":
      this.deliveredAt = now;
      break;
    case "assigned":
      this.assignedAt = now;
      break;
  }

  return this.save();
};

export default mongoose.model("Order", orderSchema);
