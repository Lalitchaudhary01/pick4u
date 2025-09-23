import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderStatus,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// protect all
router.use(authMiddleware);

// customer APIs
router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.get("/:id/status", getOrderStatus);

// driver/admin APIs
router.put("/:id/status", updateOrderStatus);

export default router;
