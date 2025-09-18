import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // allow nulls
    },
    role: {
      type: String,
      enum: ["user", "driver", "admin"],
      default: "user",
    },

    // Phone verification fields
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String, // temporary OTP storage
    },
    otpExpiry: {
      type: Date,
    },

    // 🚗 Driver-specific fields (only used if role = "driver")
    driverDetails: {
      licenseNumber: { type: String },
      vehicleNumber: { type: String },
      kycDocs: [
        {
          type: String, // Cloudinary URL or file path
        },
      ],
      kycStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      earnings: {
        type: Number,
        default: 0,
      },
    },

    // 🔑 Admin-specific fields (if needed later)
    adminDetails: {
      permissions: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
