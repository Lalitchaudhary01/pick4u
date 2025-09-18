import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Pick4U Backend Server is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
