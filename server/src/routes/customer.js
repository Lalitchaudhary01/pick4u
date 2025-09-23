// src/routes/customer.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import * as controller from "../controllers/customerController.js";

const router = express.Router();

// Protect all routes + role check
router.use(protect);
router.use(authorize("customer"));

// Profile
router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);

// Orders
router.post("/orders", controller.createOrder);
router.get("/orders", controller.getMyOrders);
router.get("/orders/:id", controller.getOrderById);
router.patch("/orders/:id/cancel", controller.cancelOrder);

export default router;
