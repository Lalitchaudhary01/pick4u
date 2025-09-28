// src/routes/driverRoutes.js
import express from "express";
import {
  kycUploadController,
  getDriverProfile,
  updateProfile,
  getDriverEarnings,
  getAssignedJobs,
  acceptJob,
  rejectJob,
  updateJobStatus,
  uploadProof,
  getEarnings,
  getReports,
} from "../controllers/driverController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All routes are protected
router.use(authMiddleware);

// KYC upload
router.post("/kyc", kycUploadController);

// Driver profile
router.get("/profile", getDriverProfile);
router.put("/profile", updateProfile);

// Earnings & reports
router.get("/earnings", getDriverEarnings); // total earnings
router.get("/jobs", getAssignedJobs); // active jobs
router.get("/reports", getReports); // completed jobs + total earnings

// Job actions
router.post("/jobs/:id/accept", acceptJob);
router.post("/jobs/:id/reject", rejectJob);
router.put("/jobs/:id/status", updateJobStatus);

// Upload proof for delivery
router.post("/jobs/:id/proof", uploadProof);

// Additional earnings route
router.get("/my-earnings", getEarnings);

export default router;
