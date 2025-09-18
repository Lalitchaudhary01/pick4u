import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary Storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pick4u/kyc", // folder in cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

// Multer upload middleware
export const upload = multer({ storage });

// Example usage in route:
// router.post("/kyc-upload", protect, authorize("driver"), upload.array("kycDocs", 5), kycUploadController);
