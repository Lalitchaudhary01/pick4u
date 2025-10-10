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
  getPendingOrders,
  getAllOrdersForDriver,
  markArrived,
  markPickedUp,
  markOnTheWay,
  markDelivered,
} from "../controllers/driverController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadKyc } from "../middleware/multer.js"; // multer middleware for KYC

const router = express.Router();

// ✅ All routes are protected
router.use(authMiddleware);

// ------------------- KYC -------------------
router.post("/kyc", uploadKyc.array("docs", 5), kycUploadController);

// ------------------- Driver Profile -------------------
router.get("/profile", getDriverProfile);
router.put("/profile", updateProfile);

// ------------------- Earnings & Reports -------------------
router.get("/earnings", getDriverEarnings); // total earnings
router.get("/jobs", getAssignedJobs); // active jobs
router.get("/reports", getReports); // completed jobs + total earnings
router.get("/my-earnings", getEarnings);

// ------------------- Jobs -------------------
router.post("/jobs/:id/accept", acceptJob);
router.post("/jobs/:id/reject", rejectJob);
router.put("/jobs/:id/status", updateJobStatus);

// ------------------- Delivery Status Updates -------------------
router.put("/jobs/:id/arrived", markArrived);
router.put("/jobs/:id/picked-up", markPickedUp);
router.put("/jobs/:id/on-the-way", markOnTheWay);
router.put("/jobs/:id/delivered", markDelivered);

// ------------------- Proof Upload -------------------
router.post("/jobs/:id/proof", uploadProof);

// ------------------- Orders -------------------
router.get("/orders/pending", getPendingOrders);
router.get("/orders/all", getAllOrdersForDriver);

export default router;
