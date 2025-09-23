import express from "express";
import { createPayment } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyPayments } from "../controllers/paymentController.js";

const router = express.Router();

router.use(authMiddleware);

// POST /api/payments
router.post("/", createPayment);

router.get("/me", getMyPayments);

export default router;
