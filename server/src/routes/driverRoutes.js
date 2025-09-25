import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import multer from "multer";
import {
  kycUploadController,
  getDriverProfile,
  getDriverEarnings,
} from "../controllers/driverController.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/kyc/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post(
  "/kyc-upload",
  protect,
  authorize("driver"),
  upload.array("kycDocs", 5),
  kycUploadController
);
router.get("/profile", protect, authorize("driver"), getDriverProfile);
router.get("/earnings", protect, authorize("driver"), getDriverEarnings);

export default router;
