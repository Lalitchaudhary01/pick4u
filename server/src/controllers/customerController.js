// src/controllers/customerController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import { calculateFare } from "../utils/fareCalc.js";
import Coupon from "../models/Coupon.js";

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      dropAddress,
      package: pkg,
      deliveryType,
      coupon,
      distanceKm,
    } = req.body;

    if (
      !pickupAddress ||
      !dropAddress ||
      !pkg ||
      !pkg.weight ||
      !deliveryType
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fare calculation
    const fare = calculateFare({
      distanceKm: distanceKm || 1,
      weightKg: pkg.weight,
      deliveryType,
    });

    const order = new Order({
      customer: req.user._id,
      pickupAddress,
      dropAddress,
      package: pkg,
      deliveryType,
      fare,
      coupon,
      meta: { distanceKm },
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all my orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("driver", "name phone");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    }).populate("driver", "name phone");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (["picked_up", "in_transit", "delivered"].includes(order.status)) {
      return res.status(400).json({ error: "Cannot cancel this order" });
    }

    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ------------------- Fare Estimate -------------------
export const fareEstimate = async (req, res) => {
  try {
    const { pickupAddress, dropAddress, packageWeight, deliveryType } =
      req.body;

    if (!pickupAddress || !dropAddress || !packageWeight) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let distance = null;
    try {
      distance = await getDistanceInKm(pickupAddress, dropAddress);
    } catch (err) {
      console.warn("Google Maps API failed, fallback to 10km");
      distance = 10;
    }

    const weightNum = parseFloat(packageWeight);
    const fare = calculateFare(distance, weightNum, deliveryType);

    res.json({
      success: true,
      fare,
      distance,
      deliveryType,
    });
  } catch (error) {
    console.error("fareEstimate:", error);
    res
      .status(500)
      .json({ message: "Error calculating fare", error: error.message });
  }
};

// ------------------- Apply Coupon -------------------
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, fare } = req.body;

    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or expired" });
    }

    // Check expiry
    if (coupon.expiry && coupon.expiry < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    // Discount calculation
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (fare * coupon.value) / 100;
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    }

    const finalFare = Math.max(fare - discount, 0);

    res.json({
      success: true,
      coupon: coupon.code,
      discount,
      finalFare,
    });
  } catch (error) {
    console.error("applyCoupon:", error);
    res
      .status(500)
      .json({ message: "Error applying coupon", error: error.message });
  }
};

// ------------------- Remove Coupon -------------------
export const removeCoupon = async (req, res) => {
  try {
    const { fare } = req.body;

    // Just return original fare
    res.json({
      success: true,
      message: "Coupon removed",
      finalFare: fare,
    });
  } catch (error) {
    console.error("removeCoupon:", error);
    res
      .status(500)
      .json({ message: "Error removing coupon", error: error.message });
  }
};
