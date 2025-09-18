import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  kycUploadController,
  // future controllers:
  // getDriverOrdersController,
  // updateAvailabilityController
} from "../controllers/driverController.js";

const router = express.Router();

// ========================
// Routes for Drivers
// ========================

// Upload KYC documents
// POST /api/drivers/kyc-upload
router.post(
  "/kyc-upload",
  protect, // verify JWT
  authorize("driver"), // allow only drivers
  upload.array("kycDocs", 5), // max 5 files
  kycUploadController
);

// Future routes examples:
// GET /api/drivers/orders
// router.get("/orders", protect, authorize("driver"), getDriverOrdersController);

// PATCH /api/drivers/availability
// router.patch("/availability", protect, authorize("driver"), updateAvailabilityController);

export default router;
