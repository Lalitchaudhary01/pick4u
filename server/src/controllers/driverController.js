import Driver from "../models/Driver.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

// Utility function for error handling
const handleError = (res, error, context) => {
  console.error(`❌ Error in ${context}:`, error);
  res.status(500).json({
    success: false,
    message: `Error ${context}`,
    error: error.message,
    timestamp: new Date().toISOString(),
  });
};

// ------------------- KYC Upload -------------------
export const kycUploadController = async (req, res) => {
  try {
    console.log("📸 KYC upload request received");

    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded. Please upload required documents.",
      });
    }

    const { licenseNumber, aadharNumber } = req.body;
    if (!licenseNumber || !aadharNumber) {
      return res.status(400).json({
        success: false,
        message: "License number and Aadhar number are required",
      });
    }

    // Validate license and Aadhar format
    if (!/^[A-Z]{2}\d{13}$/.test(licenseNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid license number format",
      });
    }

    if (!/^\d{12}$/.test(aadharNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhar number format",
      });
    }

    const docs = files.map((f) => `/uploads/kyc/${f.filename}`);
    const userId = req.user._id;

    console.log(`👤 Processing KYC for user: ${userId}`);

    let driver = await Driver.findOne({ user: userId });

    if (!driver) {
      console.log("🆕 Creating new driver profile with KYC");
      driver = await Driver.create({
        user: userId,
        kycDocs: docs,
        licenseNumber: licenseNumber.trim(),
        aadharNumber: aadharNumber.trim(),
        kycStatus: "PENDING",
        availability: false, // Not available until KYC approved
      });
    } else {
      console.log("📝 Updating existing driver KYC");
      driver.kycDocs = docs;
      driver.licenseNumber = licenseNumber.trim();
      driver.aadharNumber = aadharNumber.trim();
      driver.kycStatus = "PENDING";
      driver.availability = false; // Reset availability on KYC update
      await driver.save();
    }

    // Populate user details
    await driver.populate("user", "name email phone");

    console.log(`✅ KYC submitted successfully for driver: ${driver._id}`);

    res.json({
      success: true,
      message: "KYC submitted successfully and under review",
      driver: {
        _id: driver._id,
        kycStatus: driver.kycStatus,
        licenseNumber: driver.licenseNumber,
        aadharNumber: driver.aadharNumber,
        kycDocs: driver.kycDocs,
        user: driver.user,
      },
    });
  } catch (error) {
    handleError(res, error, "uploading KYC");
  }
};

// ------------------- Get Driver Profile -------------------
export const getDriverProfile = async (req, res) => {
  try {
    console.log("🔍 Fetching driver profile for user:", req.user._id);

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
    }

    let driver = await Driver.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone role"
    );

    // ✅ If driver doesn't exist, create a basic profile
    if (!driver) {
      console.log("🚨 No driver profile found, creating basic profile...");

      try {
        driver = await Driver.create({
          user: req.user._id,
          kycStatus: "PENDING",
          availability: false,
          earnings: 0,
          licenseNumber: "",
          aadharNumber: "",
          kycDocs: [],
        });

        await driver.populate("user", "name email phone role");
        console.log("✅ Created new driver profile:", driver._id);
      } catch (createError) {
        console.error("❌ Error creating driver profile:", createError);

        // Return basic profile without saving to DB
        return res.json({
          _id: req.user._id,
          kycStatus: "PENDING",
          availability: false,
          earnings: 0,
          user: {
            _id: req.user._id,
            name: req.user.name || "Driver",
            email: req.user.email || "",
            phone: req.user.phone || "",
            role: req.user.role,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    console.log("✅ Driver profile fetched successfully");

    res.json({
      _id: driver._id,
      kycStatus: driver.kycStatus,
      availability: driver.availability,
      earnings: driver.earnings,
      licenseNumber: driver.licenseNumber,
      aadharNumber: driver.aadharNumber,
      kycDocs: driver.kycDocs || [],
      user: driver.user,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    });
  } catch (error) {
    handleError(res, error, "fetching profile");
  }
};

// ------------------- Update Profile -------------------
export const updateProfile = async (req, res) => {
  try {
    const { availability } = req.body;

    if (typeof availability !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Availability must be a boolean value",
      });
    }

    // Check if driver has approved KYC before allowing availability
    const existingDriver = await Driver.findOne({ user: req.user._id });
    if (availability && existingDriver?.kycStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Cannot set availability without approved KYC",
      });
    }

    const driver = await Driver.findOneAndUpdate(
      { user: req.user._id },
      {
        availability,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email phone role");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    console.log(`✅ Driver availability updated to: ${availability}`);

    res.json({
      success: true,
      message: `Profile updated successfully - ${
        availability ? "Available" : "Unavailable"
      }`,
      driver: {
        _id: driver._id,
        availability: driver.availability,
        kycStatus: driver.kycStatus,
        user: driver.user,
      },
    });
  } catch (error) {
    handleError(res, error, "updating profile");
  }
};

// ------------------- Get Earnings -------------------
export const getDriverEarnings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Calculate real-time earnings from completed orders
    const completedOrders = await Order.find({
      assignedDriver: req.user._id,
      status: "delivered",
    });

    const totalEarnings = completedOrders.reduce(
      (sum, order) => sum + (order.fare || 0),
      0
    );

    // Update driver earnings if different
    if (driver.earnings !== totalEarnings) {
      driver.earnings = totalEarnings;
      await driver.save();
    }

    res.json({
      success: true,
      total: totalEarnings,
      currency: "INR",
      completedJobs: completedOrders.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    handleError(res, error, "fetching earnings");
  }
};

// ------------------- Get Assigned Jobs -------------------
export const getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Order.find({
      assignedDriver: req.user._id,
      status: {
        $in: ["accepted", "assigned", "arrived", "picked-up", "on-the-way"],
      },
    })
      .populate("customer", "name phone email")
      .sort({ createdAt: -1 });

    console.log(
      `✅ Found ${jobs.length} assigned jobs for driver: ${req.user._id}`
    );

    res.json({
      success: true,
      jobs: jobs.map((job) => ({
        _id: job._id,
        status: job.status,
        pickupAddress: job.pickupAddress,
        deliveryAddress: job.deliveryAddress,
        fare: job.fare,
        customer: job.customer,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      })),
    });
  } catch (error) {
    handleError(res, error, "fetching assigned jobs");
  }
};

// ------------------- Accept Job -------------------
export const acceptJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Check driver availability and KYC status
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    if (!driver.availability) {
      return res.status(400).json({
        success: false,
        message:
          "Driver is not available. Please set availability to accept jobs.",
      });
    }

    if (driver.kycStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "KYC must be approved to accept jobs",
      });
    }

    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("assignedDriver", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is still available
    if (order.status !== "pending" && order.status !== "assigned") {
      return res.status(400).json({
        success: false,
        message: "Order is no longer available",
      });
    }

    // Check if driver already has active jobs (limit to 3 concurrent jobs)
    const activeJobsCount = await Order.countDocuments({
      assignedDriver: req.user._id,
      status: {
        $in: ["accepted", "assigned", "arrived", "picked-up", "on-the-way"],
      },
    });

    if (activeJobsCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "You have reached the maximum limit of 3 active jobs",
      });
    }

    // Update order status
    order.status = "accepted";
    order.assignedDriver = req.user._id;
    order.acceptedAt = new Date();
    await order.save();

    const io = req.app.get("io");

    // Notify customer
    io.to(order.customer._id.toString()).emit("order-accepted", {
      order: order,
      driver: {
        _id: req.user._id,
        name: req.user.name,
        phone: req.user.phone,
      },
      timestamp: new Date().toISOString(),
    });

    // Notify admin
    io.to("admin").emit("order-accepted", {
      order: order,
      driver: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      timestamp: new Date().toISOString(),
    });

    // Notify other drivers that order is taken
    io.emit("order-taken", {
      orderId: order._id,
      timestamp: new Date().toISOString(),
    });

    console.log(`✅ Job ${id} accepted by driver ${req.user._id}`);

    res.json({
      success: true,
      message: "Job accepted successfully",
      order: {
        _id: order._id,
        status: order.status,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        fare: order.fare,
        customer: order.customer,
        acceptedAt: order.acceptedAt,
      },
    });
  } catch (error) {
    handleError(res, error, "accepting job");
  }
};

// ------------------- Reject Job -------------------
export const rejectJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("assignedDriver", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Reset order status
    order.assignedDriver = null;
    order.status = "pending";
    order.rejectedAt = new Date();
    await order.save();

    const io = req.app.get("io");

    // Notify admin
    io.to("admin").emit("order-rejected", {
      order: order,
      driver: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      timestamp: new Date().toISOString(),
    });

    // Notify customer if order was previously assigned
    if (order.customer) {
      io.to(order.customer._id.toString()).emit("order-rejected", {
        order: order,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`❌ Job ${id} rejected by driver ${req.user._id}`);

    res.json({
      success: true,
      message: "Job rejected successfully",
      order: {
        _id: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    handleError(res, error, "rejecting job");
  }
};

// ------------------- Get Pending Orders -------------------
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: "pending",
      assignedDriver: { $exists: false },
    })
      .populate("customer", "name phone email")
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent overload

    console.log(`✅ Found ${orders.length} pending orders`);

    res.json({
      success: true,
      orders: orders.map((order) => ({
        _id: order._id,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        fare: order.fare,
        distance: order.distance,
        customer: order.customer,
        status: order.status,
        createdAt: order.createdAt,
        urgent: order.priority === "high",
      })),
      total: orders.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleError(res, error, "fetching pending orders");
  }
};

// ------------------- Delivery Status Updates -------------------
// In your driverController.js - update these functions:

export const markArrived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer assignedDriver",
      "name email phone"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your job" });

    // ✅ Use the method we created
    await order.updateStatus("arrived");

    const io = req.app.get("io");
    io.to(order.customer._id.toString()).emit("order-arrived", order);
    io.to("admin").emit("order-arrived", order);

    res.json({ success: true, message: "Driver arrived at pickup", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

export const markPickedUp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer assignedDriver",
      "name email phone"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your job" });

    // ✅ Use the method we created
    await order.updateStatus("picked-up");

    const io = req.app.get("io");
    io.to(order.customer._id.toString()).emit("order-picked", order);
    io.to("admin").emit("order-picked", order);

    res.json({ success: true, message: "Package picked up", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

export const markOnTheWay = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer assignedDriver",
      "name email phone"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your job" });

    // ✅ Use the method we created
    await order.updateStatus("on-the-way");

    const io = req.app.get("io");
    io.to(order.customer._id.toString()).emit("order-on-the-way", order);
    io.to("admin").emit("order-on-the-way", order);

    res.json({ success: true, message: "Driver is on the way", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer assignedDriver",
      "name email phone"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.assignedDriver?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your job" });

    // ✅ Use the method we created
    await order.updateStatus("delivered");

    const io = req.app.get("io");
    io.to(order.customer._id.toString()).emit("order-delivered", order);
    io.to("admin").emit("order-delivered", order);

    res.json({ success: true, message: "Order delivered successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

// ------------------- Upload Proof -------------------
export const uploadProof = async (req, res) => {
  try {
    const { id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        message: "Photo URL is required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.assignedDriver?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your job" });
    }

    order.proofPhoto = photoUrl;
    order.proofUploadedAt = new Date();
    await order.save();

    const io = req.app.get("io");

    // Notify admin about proof upload
    io.to("admin").emit("proof-uploaded", {
      orderId: order._id,
      proofPhoto: photoUrl,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Proof uploaded successfully",
      order: {
        _id: order._id,
        proofPhoto: order.proofPhoto,
        proofUploadedAt: order.proofUploadedAt,
      },
    });
  } catch (error) {
    handleError(res, error, "uploading proof");
  }
};

// ------------------- Get Reports -------------------
export const getReports = async (req, res) => {
  try {
    const { period = "all" } = req.query; // all, week, month

    let dateFilter = {};
    if (period === "week") {
      dateFilter = {
        deliveredAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      };
    } else if (period === "month") {
      dateFilter = {
        deliveredAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      };
    }

    const orders = await Order.find({
      assignedDriver: req.user._id,
      status: "delivered",
      ...dateFilter,
    }).sort({ deliveredAt: -1 });

    const totalEarnings = orders.reduce(
      (sum, order) => sum + (order.fare || 0),
      0
    );
    const totalJobs = orders.length;

    // Calculate average rating
    const ratedOrders = orders.filter((order) => order.rating);
    const averageRating =
      ratedOrders.length > 0
        ? ratedOrders.reduce((sum, order) => sum + order.rating, 0) /
          ratedOrders.length
        : 0;

    res.json({
      success: true,
      period: period,
      totalJobs,
      totalEarnings,
      averageRating: Math.round(averageRating * 10) / 10,
      completedOrders: orders.map((order) => ({
        _id: order._id,
        fare: order.fare,
        deliveredAt: order.deliveredAt,
        rating: order.rating,
        customerFeedback: order.customerFeedback,
      })),
      summary: {
        period: period,
        startDate: period !== "all" ? dateFilter.deliveredAt.$gte : null,
        endDate: new Date(),
        currency: "INR",
      },
    });
  } catch (error) {
    handleError(res, error, "fetching reports");
  }
};

// ------------------- Get All Orders (for driver dashboard) -------------------
export const getAllOrdersForDriver = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ assignedDriver: req.user._id }, { status: "pending" }],
    })
      .populate("customer assignedDriver", "name email phone")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      orders: orders.map((order) => ({
        _id: order._id,
        status: order.status,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        fare: order.fare,
        customer: order.customer,
        assignedDriver: order.assignedDriver,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        isAssignedToMe:
          order.assignedDriver?._id?.toString() === req.user._id.toString(),
      })),
      total: orders.length,
    });
  } catch (error) {
    handleError(res, error, "fetching all orders");
  }
};

export default {
  kycUploadController,
  getDriverProfile,
  updateProfile,
  getDriverEarnings,
  getAssignedJobs,
  acceptJob,
  rejectJob,
  getPendingOrders,
  markArrived,
  markPickedUp,
  markOnTheWay,
  markDelivered,
  uploadProof,
  getReports,
  getAllOrdersForDriver,
};
