import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// protect all
router.use(authMiddleware);

// get my profile
router.get("/me", getProfile);

// update my profile
router.put("/me", updateProfile);

export default router;
