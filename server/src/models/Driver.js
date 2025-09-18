import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "car", "van"],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    kycDocuments: [
      {
        type: String, // Cloudinary URLs of uploaded docs
      },
    ],
    isKycApproved: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
