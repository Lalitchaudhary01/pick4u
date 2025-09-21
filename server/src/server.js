import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import connectDB from "./config/db.js"; // Import your MongoDB connection function

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(); // ⚠️ Make sure this is called

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Pick4U Backend Server is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/driver", driverRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
