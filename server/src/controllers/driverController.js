import Driver from "../models/Driver.js";

import Order from "../models/Order.js";

// ------------------- Upload KYC -------------------
export const kycUploadController = async (req, res) => {
  try {
    const { docs } = req.body; // array of file paths

    let driver = await Driver.findOne({ user: req.user.id });
    if (!driver) {
      driver = await Driver.create({ user: req.user.id, kycDocs: docs });
    } else {
      driver.kycDocs = docs;
      driver.kycStatus = "PENDING";
      await driver.save();
    }

    res.json({ success: true, message: "KYC submitted", driver });
  } catch (error) {
    console.error("uploadKyc:", error);
    res
      .status(500)
      .json({ message: "Error uploading KYC", error: error.message });
  }
};

// Get driver profile
// ------------------- Get Profile -------------------
export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id }).populate(
      "user",
      "name email phone role"
    );
    res.json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// ------------------- Update Profile -------------------
export const updateProfile = async (req, res) => {
  try {
    const { availability } = req.body;
    const driver = await Driver.findOneAndUpdate(
      { user: req.user.id },
      { availability },
      { new: true }
    );
    res.json({ success: true, driver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Get earnings
export const getDriverEarnings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ total: driver.earnings });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch earnings", error: err.message });
  }
};

// ------------------- Get Assigned Jobs -------------------
export const getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Order.find({
      assignedDriver: req.user.id,
      status: { $ne: "delivered" },
    });
    res.json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

// ------------------- Accept Job -------------------
export const acceptJob = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending")
      return res.status(400).json({ message: "Order already taken" });

    order.assignedDriver = req.user.id;
    order.status = "assigned";
    await order.save();

    res.json({ success: true, message: "Job accepted", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting job", error: error.message });
  }
};

// ------------------- Reject Job -------------------
export const rejectJob = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedDriver?.toString() === req.user.id) {
      order.assignedDriver = null;
      order.status = "pending";
      await order.save();
    }

    res.json({ success: true, message: "Job rejected", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting job", error: error.message });
  }
};

// ------------------- Update Delivery Status -------------------
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body; // arrived, picked-up, delivered
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your job" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

// ------------------- Upload Proof -------------------
export const uploadProof = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your job" });

    order.proofPhoto = photoUrl;
    await order.save();

    res.json({ success: true, message: "Proof uploaded", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading proof", error: error.message });
  }
};

// ------------------- Earnings -------------------
export const getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });
    res.json({ earnings: driver.earnings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching earnings", error: error.message });
  }
};

// ------------------- Reports -------------------
export const getReports = async (req, res) => {
  try {
    const orders = await Order.find({
      assignedDriver: req.user.id,
      status: "delivered",
    });
    const totalEarnings = orders.reduce((sum, o) => sum + o.fare, 0);

    res.json({
      totalJobs: orders.length,
      totalEarnings,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};
