// src/controllers/customerController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import { calculateFare } from "../utils/fareCalc.js";

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
