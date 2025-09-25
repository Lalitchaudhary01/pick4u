import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderStatus,
  updateOrderStatus,
  assignDriver,
  acceptOrder,
  rejectOrder,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------- CUSTOMER ROUTES --------------------

// Create new order (Customer only)
router.post("/", protect, authorize("customer"), createOrder);

// Get all my orders (Customer only)
router.get("/", protect, authorize("customer"), getMyOrders);

// Get specific order by ID (Customer only)
router.get("/:id", protect, authorize("customer"), getOrderById);

// Get order status (Customer only)
router.get("/:id/status", protect, authorize("customer"), getOrderStatus);

// -------------------- ADMIN + DRIVER ROUTES --------------------

// Update order status (Admin + Driver)
router.put(
  "/:id/status",
  protect,
  authorize("admin", "driver"),
  updateOrderStatus
);

// Assign driver to an order (Admin only)
router.put("/:id/assign-driver", protect, authorize("admin"), assignDriver);

// Driver accepts an order
router.put("/:id/accept", protect, authorize("driver"), acceptOrder);

// Driver rejects an order
router.put("/:id/reject", protect, authorize("driver"), rejectOrder);

export default router;
