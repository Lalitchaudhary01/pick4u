// routes/driverRoutes.js
import express from "express";
import {
  kycUploadController,
  getDriverProfile,
  updateDriverProfile,
  getPendingOrders,
  getAssignedJobs,
  acceptOrder,
  rejectOrder,
  updateJobStatus,
  uploadProof,
  getEarnings,
  getReports,
} from "../controllers/driverController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/kyc/" });

// All routes protected by auth middleware
router.use(authMiddleware);

// ---------------- KYC ----------------
router.post("/kyc", upload.array("files"), kycUploadController);

// ---------------- Profile ----------------
router.get("/profile", getDriverProfile);
router.patch("/profile", updateDriverProfile);

// ---------------- Orders ----------------
// View pending orders (not yet assigned)
router.get("/orders/pending", getPendingOrders);
// View assigned jobs
router.get("/orders/assigned", getAssignedJobs);
// Accept / Reject order
router.post("/orders/:id/accept", acceptOrder);
router.post("/orders/:id/reject", rejectOrder);
// Update delivery status
router.patch("/orders/:id/status", updateJobStatus);
// Upload proof photo
router.post("/orders/:id/proof", uploadProof);

// ---------------- Earnings & Reports ----------------
router.get("/earnings", getEarnings);
router.get("/reports", getReports);

export default router;
