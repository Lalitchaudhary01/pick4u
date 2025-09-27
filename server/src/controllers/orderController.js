// controllers/orderController.js
import Order from "../models/Order.js";
import { getDistanceInKm } from "../services/mapService.js";

// ------------------- Fare Calculation -------------------
const calculateFare = (distance, weight, deliveryType) => {
  let base = 50; // base fare
  let perKm = 8;
  let perKg = 10;
  let total = base + distance * perKm + weight * perKg;

  if (deliveryType === "instant") total += 50;
  if (deliveryType === "same-day") total += 30;

  return Math.round(total);
};

// ------------------- Create Order -------------------
export const createOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      dropAddress,
      packageWeight,
      deliveryType,
      couponCode,
    } = req.body;

    // Debug logs
    console.log("👉 Incoming Order Body:", req.body);
    console.log("👉 Authenticated User:", req.user);

    if (!pickupAddress || !dropAddress || !packageWeight) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert weight to number (avoid string bugs)
    const weightNum = parseFloat(packageWeight);

    // Get distance from Google Maps
    let distance = null;
    try {
      distance = await getDistanceInKm(pickupAddress, dropAddress);
    } catch (mapErr) {
      console.error("❌ Google Maps API failed:", mapErr.message);
    }

    console.log("👉 Calculated Distance:", distance);

    // Fallback if Google Maps fails
    if (!distance || isNaN(distance)) {
      console.warn("⚠️ Using fallback distance (10 km)");
      distance = 10;
    }

    const fare = calculateFare(distance, weightNum, deliveryType);

    const order = await Order.create({
      customer: req.user?.id, // ensure user is attached by protect middleware
      pickupAddress,
      dropAddress,
      packageWeight: weightNum,
      deliveryType,
      couponCode,
      fare,
      distance, // store distance in DB
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
      distance: `${distance.toFixed(2)} km`,
    });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ------------------- Get My Orders -------------------
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// ------------------- Get Order By ID -------------------
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "assignedDriver",
      "name email phone"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// ------------------- Get Order Status -------------------
export const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      req.user.role === "customer" &&
      order.customer.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to view this order" });
    }

    res.json({ orderId: order._id, status: order.status });
  } catch (error) {
    console.error("❌ Error fetching status:", error);
    res
      .status(500)
      .json({ message: "Error fetching status", error: error.message });
  }
};

// ------------------- Update Order Status -------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      req.user.role === "driver" &&
      order.assignedDriver?.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this order" });
    }
    if (req.user.role === "customer") {
      return res.status(403).json({ message: "Customer cannot update status" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

// ------------------- Assign Driver (Admin only) -------------------
export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.assignedDriver = driverId;
    order.status = "assigned";
    await order.save();

    res.json({ success: true, message: "Driver assigned", order });
  } catch (error) {
    console.error("❌ Error assigning driver:", error);
    res
      .status(500)
      .json({ message: "Error assigning driver", error: error.message });
  }
};

// ------------------- Driver Accepts -------------------
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.assignedDriver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.status = "accepted";
    await order.save();

    res.json({ success: true, message: "Order accepted", order });
  } catch (error) {
    console.error("❌ Error accepting order:", error);
    res
      .status(500)
      .json({ message: "Error accepting order", error: error.message });
  }
};

// ------------------- Driver Rejects -------------------
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.assignedDriver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.status = "rejected";
    order.assignedDriver = null;
    await order.save();

    res.json({ success: true, message: "Order rejected", order });
  } catch (error) {
    console.error("❌ Error rejecting order:", error);
    res
      .status(500)
      .json({ message: "Error rejecting order", error: error.message });
  }
};
