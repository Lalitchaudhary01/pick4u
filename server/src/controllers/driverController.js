import Driver from "../models/Driver.js";

import Order from "../models/Order.js";

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
        .json({ success: false, message: "License and Aadhar are required" });

    const docs = files.map((f) => `/uploads/kyc/${f.filename}`);

    const userId = req.user._id || req.user.id;
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
    const order = await Order.findById(req.params.id).populate(
      "customer assignedDriver",
      "name email phone"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending" && order.status !== "assigned")
      return res.status(400).json({ message: "Order already taken" });

    order.status = "picked"; // or "assigned" depending on your flow
    order.assignedDriver = req.user.id;
    await order.save();

    const io = req.app.get("io");

    // Notify customer
    io.to(order.customer._id.toString()).emit("order-accepted", order);

    // Notify admin
    io.to("admin").emit("order-accepted", order);

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
    const order = await Order.findById(req.params.id).populate(
      "customer assignedDriver",
      "name email phone"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.assignedDriver = null;
    order.status = "pending";
    await order.save();

    const io = req.app.get("io");

    // Notify admin
    io.to("admin").emit("order-rejected", order);

    // Notify customer (optional)
    io.to(order.customer._id.toString()).emit("order-rejected", order);

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

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).populate(
      "customer",
      "name phone email"
    );
    res.json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending orders", error: error.message });
  }
};

export const getAllOrdersForDriver = async (req, res) => {
  try {
    // Fetch all orders with customer + assignedDriver info
    const orders = await Order.find().populate(
      "customer assignedDriver",
      "name email phone"
    );

    res.json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

export const markArrived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer assignedDriver", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "arrived";
    await order.save();

    const io = req.app.get("io");

    // Notify customer
    io.to(order.customer._id.toString()).emit("order-arrived", order);

    // Notify admin
    io.to("admin").emit("order-arrived", order);

    res.json({ success: true, message: "Driver arrived at pickup", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

export const markPickedUp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer assignedDriver", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "picked-up";
    await order.save();

    const io = req.app.get("io");

    io.to(order.customer._id.toString()).emit("order-picked", order);
    io.to("admin").emit("order-picked", order);

    res.json({ success: true, message: "Package picked up", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

export const markOnTheWay = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer assignedDriver", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "on-the-way";
    await order.save();

    const io = req.app.get("io");

    io.to(order.customer._id.toString()).emit("order-on-the-way", order);
    io.to("admin").emit("order-on-the-way", order);

    res.json({ success: true, message: "Driver is on the way", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer assignedDriver", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "delivered";
    order.deliveredAt = Date.now();
    await order.save();

    const io = req.app.get("io");

    io.to(order.customer._id.toString()).emit("order-delivered", order);
    io.to("admin").emit("order-delivered", order);

    res.json({ success: true, message: "Order delivered successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};
