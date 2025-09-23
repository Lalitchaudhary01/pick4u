// import express from "express";
// import {
//   registerController,
//   verifyOTPController,
//   loginController,
// } from "../controllers/authController.js";

// const router = express.Router();

// // Register new user (user/driver/admin)
// router.post("/register", registerController);

// // Verify OTP sent via Twilio
// router.post("/verify-otp", verifyOTPController);

// // Login
// router.post("/login", loginController);

// export default router;

import express from "express";
import {
  registerController,
  loginController,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Register new user (user/driver/admin)
router.post("/register", registerController);

// Login
router.post("/login", loginController);
router.post("/logout", logout);

export default router;
