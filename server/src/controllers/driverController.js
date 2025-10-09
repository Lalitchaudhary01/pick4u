// controllers/driverController.js
import Driver from "../models/Driver.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// ------------------- KYC -------------------
export const kycUploadController = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length)
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });

    const { licenseNumber, aadharNumber } = req.body;
    if (!licenseNumber || !aadharNumber)
      return res
        .status(400)
        .json({ success: false, message: "License and Aadhar required" });

    const docs = files.map((f) => `/uploads/kyc/${f.filename}`);
    const userId = req.user._id;

    let driver = await Driver.findOne({ user: userId });
    if (!driver) {
      driver = await Driver.create({
        user: userId,
        kycDocs: docs,
        licenseNumber,
        aadharNumber,
        kycStatus: "PENDING",
      });
    } else {
      driver.kycDocs = docs;
      driver.licenseNumber = licenseNumber;
      driver.aadharNumber = aadharNumber;
      driver.kycStatus = "PENDING";
      await driver.save();
    }

    res.json({ success: true, message: "KYC submitted", driver });
  } catch (error) {
    console.error("KYC Error:", error);
    res
      .status(500)
      .json({ message: "Error uploading KYC", error: error.message });
  }
};

// ------------------- Profile -------------------
export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id }).populate(
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

export const updateDriverProfile = async (req, res) => {
  try {
    const { availability } = req.body;
    const driver = await Driver.findOneAndUpdate(
      { user: req.user._id },
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

// ------------------- Orders -------------------
// Pending orders (available to accept)
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending orders", error: error.message });
  }
};

// Assigned jobs
export const getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Order.find({
      assignedDriver: req.user._id,
      status: { $ne: "delivered" },
    });
    res.json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assigned jobs", error: error.message });
  }
};

// Accept an order
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Order already assigned" });

    order.assignedDriver = req.user._id;
    order.status = "assigned";
    await order.save();

    // Notify customer & admin via socket
    const io = req.app.get("io");
    io.to(order.customer.toString()).emit("order-accepted", order);
    io.emit("order-updated", order);

    res.json({ success: true, message: "Order accepted", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting order", error: error.message });
  }
};

// Reject an order
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedDriver?.toString() === req.user._id.toString()) {
      order.assignedDriver = null;
      order.status = "pending";
      await order.save();
    }

    const io = req.app.get("io");
    io.emit("order-rejected", { orderId: order._id, driverId: req.user._id });

    res.json({ success: true, message: "Order rejected", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting order", error: error.message });
  }
};

// Update delivery status
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body; // arrived, picked-up, delivered
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user._id.toString())
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

// Upload proof photo
export const uploadProof = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user._id.toString())
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
    const driver = await Driver.findOne({ user: req.user._id });
    res.json({ earnings: driver?.earnings || 0 });
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
      assignedDriver: req.user._id,
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
