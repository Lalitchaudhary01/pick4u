// src/routes/adminRoutes.js
import express from "express";
import {
  getDashboard,
  getAllOrders,
  assignDriver,
  cancelOrderByAdmin,
  getDrivers,
  getPendingKycDrivers,
  approveDriver,
  rejectDriver,
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

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All routes are protected
router.use(authMiddleware);

// ---------------- Dashboard ----------------
router.get("/dashboard", getDashboard);

// ---------------- Orders ----------------
router.get("/orders", getAllOrders);
router.put("/orders/:id/assign", assignDriver);
router.put("/orders/:id/cancel", cancelOrderByAdmin);

// ---------------- Drivers ----------------
router.get("/drivers", getDrivers); // all drivers
router.get("/drivers/pending-kyc", getPendingKycDrivers); // pending KYC requests
router.put("/drivers/:id/approve", approveDriver); // approve KYC
router.put("/drivers/:id/reject", rejectDriver); // reject KYC
router.put("/drivers/:id/block", blockDriver); // block/unblock driver

// ---------------- Customers ----------------
router.get("/customers", getAllCustomers);
router.put("/customers/:id/suspend", suspendCustomer);

// ---------------- Coupons ----------------
router.post("/coupons", createCoupon);
router.get("/coupons", getCoupons);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// ---------------- Fare Config ----------------
router.get("/fare-config", getFareConfig);
router.put("/fare-config", updateFareConfig);

export default router;
