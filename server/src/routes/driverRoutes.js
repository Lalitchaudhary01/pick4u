import express from "express";
import { getProfile, uploadKYC } from "../controllers/driverController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Route: POST /api/driver/upload-kyc
router.post(
  "/upload-kyc",
  protect,
  authorize("driver"),
  upload.array("kycDocs", 5), // max 5 files
  uploadKYC
);

// Route: GET /api/driver/profile
router.get("/profile", protect, authorize("driver"), getProfile);

export default router;
