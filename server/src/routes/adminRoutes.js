import express from "express";
import {
  getDashboard,
  getAllOrders,
  assignDriver,
  cancelOrder,
  approveDriver,
  blockDriver,
  getAllCustomers,
  suspendCustomer,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  getFareConfig,
  updateFareConfig,
} from "../controllers/adminController.js";

import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", authMiddleware, adminOnly, getDashboard);

// Orders
router.get("/orders", authMiddleware, adminOnly, getAllOrders);
router.put("/orders/:id/assign", authMiddleware, adminOnly, assignDriver);
router.put("/orders/:id/cancel", authMiddleware, adminOnly, cancelOrder);

// Drivers
router.put("/drivers/:id/approve", authMiddleware, adminOnly, approveDriver);
router.put("/drivers/:id/block", authMiddleware, adminOnly, blockDriver);

// Customers
router.get("/customers", authMiddleware, adminOnly, getAllCustomers);
router.put(
  "/customers/:id/suspend",
  authMiddleware,
  adminOnly,
  suspendCustomer
);

// Coupons
router.post("/coupons", authMiddleware, adminOnly, createCoupon);
router.get("/coupons", authMiddleware, adminOnly, getCoupons);
router.put("/coupons/:id", authMiddleware, adminOnly, updateCoupon);
router.delete("/coupons/:id", authMiddleware, adminOnly, deleteCoupon);

// Fare Config
router.get("/fare-config", authMiddleware, adminOnly, getFareConfig);
router.put("/fare-config", authMiddleware, adminOnly, updateFareConfig);

// ✅ Default export fix
export default router;
