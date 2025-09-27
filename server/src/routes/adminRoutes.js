// server/src/routes/adminRoutes.js
import express from "express";
import {
  getStats,
  getUsers,
  blockUser,
  getDrivers,
  approveDriver,
  rejectDriver,
  getOrders,
  assignDriverToOrder,
  cancelOrder,
  getEarnings,
  getReports,
} from "../controllers/adminController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// all routes protected: auth + adminOnly
router.use(authMiddleware, adminOnly);

// Stats
router.get("/stats", getStats);

// Users
router.get("/users", getUsers);
router.put("/users/:id/block", blockUser);

// Drivers
router.get("/drivers", getDrivers);
router.put("/drivers/:id/approve", approveDriver);
router.put("/drivers/:id/reject", rejectDriver);

// Orders
router.get("/orders", getOrders);
router.put("/orders/:id/assign", assignDriverToOrder);
router.put("/orders/:id/cancel", cancelOrder);

// Earnings & Reports
router.get("/earnings", getEarnings);
router.get("/reports", getReports);

export default router;
