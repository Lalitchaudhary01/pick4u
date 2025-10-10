import Order from "../models/Order.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import FareConfig from "../models/FareConfig.js";

// ---------------- Dashboard ----------------
export const getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({
      status: { $ne: "delivered" },
    });
    const drivers = await Driver.countDocuments();
    const customers = await User.countDocuments({ role: "customer" });

    res.json({
      totalOrders,
      activeOrders,
      totalDrivers: drivers,
      totalCustomers: customers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard", error: error.message });
  }
};

// ---------------- Orders ----------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "customer assignedDriver",
      "name email"
    );
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const io = req.app.get("io");

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedDriver: driverId, status: "assigned" },
      { new: true }
    ).populate("customer assignedDriver", "name email phone");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Notify driver
    io.to(driverId).emit("new-assignment", order);

    // Notify customer
    io.to(order.customer._id.toString()).emit("driver-assigned", order);

    res.json({ success: true, message: "Driver assigned", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning driver", error: error.message });
  }
};

export const cancelOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
};

// ---------------- Drivers ----------------
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("user", "name email role");
    res.json(drivers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching drivers", error: error.message });
  }
};

// ✅ NEW: Pending KYC requests
export const getPendingKycDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ kycStatus: "PENDING" }).populate(
      "user",
      "name email role"
    );
    res.json(drivers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending KYC drivers",
      error: error.message,
    });
  }
};

// Approve driver KYC
export const approveDriver = async (req, res) => {
  try {
    const io = req.app.get("io");

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { kycStatus: "APPROVED", availability: true },
      { new: true }
    ).populate("user", "name email");

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Notify driver of approval
    io.to(driver._id.toString()).emit("kyc-approved", driver);

    res.json({ success: true, message: "Driver approved", driver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving driver", error: error.message });
  }
};

// Reject driver KYC
export const rejectDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { kycStatus: "REJECTED", kycDocs: [] },
      { new: true }
    );
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ success: true, message: "Driver KYC rejected", driver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting driver", error: error.message });
  }
};

// Block/unblock driver
export const blockDriver = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "driver")
      return res.status(404).json({ message: "Driver not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      success: true,
      message: `Driver ${user.isBlocked ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error blocking driver", error: error.message });
  }
};

// ---------------- Customers ----------------
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" });
    res.json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: error.message });
  }
};

export const suspendCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "customer")
      return res.status(404).json({ message: "Customer not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      success: true,
      message: `Customer ${user.isBlocked ? "suspended" : "activated"}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating customer", error: error.message });
  }
};

// ---------------- Coupons ----------------
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json({ success: true, coupon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating coupon", error: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coupons", error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, coupon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating coupon", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting coupon", error: error.message });
  }
};

// ---------------- Fare Config ----------------
export const getFareConfig = async (req, res) => {
  try {
    const config = await FareConfig.findOne();
    res.json(config);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fare config", error: error.message });
  }
};

export const updateFareConfig = async (req, res) => {
  try {
    let config = await FareConfig.findOne();
    if (!config) config = await FareConfig.create(req.body);
    else {
      Object.assign(config, req.body);
      await config.save();
    }
    res.json({ success: true, config });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating fare config", error: error.message });
  }
};

// ---------------- Fare Calculation ----------------
export const calculateFareWithConfig = async (
  distance,
  weight,
  deliveryType
) => {
  const config = (await FareConfig.findOne()) || {};
  let total =
    (config.baseFare || 50) +
    distance * (config.perKmRate || 8) +
    weight * (config.perKgRate || 10);

  if (deliveryType === "instant") total += config.instantDeliveryFee || 50;
  if (deliveryType === "same-day") total += config.sameDayDeliveryFee || 30;

  total = total * (config.peakHourMultiplier || 1.0);
  return Math.round(total);
};
