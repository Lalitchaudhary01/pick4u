import express from "express";
import { getProfile, uploadKYC } from "../controllers/driverController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Route: POST /api/driver/upload-kyc
router.post(
  "/upload-kyc",
  authMiddleware,
  uploadMiddleware.array("kycDocs"),
  uploadKYC
);
router.get("/profile", authMiddleware, getProfile);

export default router;
