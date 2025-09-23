import Order from "../models/Order.js";
import { getDistanceInKm } from "../services/mapService.js";

// Updated Fare Calculation
const calculateFare = (distance, weight, deliveryType) => {
  let base = 50; // base fare
  let perKm = 8;
  let perKg = 10;
  let total = base + distance * perKm + weight * perKg;

  if (deliveryType === "instant") total += 50;
  if (deliveryType === "same-day") total += 30;

  return Math.round(total);
};

// Create Order with Google Maps Distance
export const createOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      dropAddress,
      packageWeight,
      deliveryType,
      couponCode,
    } = req.body;

    if (!pickupAddress || !dropAddress || !packageWeight) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get distance from Google Maps
    const distance = await getDistanceInKm(pickupAddress, dropAddress);
    if (!distance) {
      return res.status(500).json({ message: "Could not calculate distance" });
    }

    const fare = calculateFare(distance, packageWeight, deliveryType);

    const order = await Order.create({
      customer: req.user.id,
      pickupAddress,
      dropAddress,
      packageWeight,
      deliveryType,
      couponCode,
      fare,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
      distance: `${distance.toFixed(2)} km`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Order creation failed", error: error.message });
  }
};

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "assignedDriver",
      "name email phone"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// Get Order Status by ID
export const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // agar customer hai to check karo ki order uska hi hai
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
    res
      .status(500)
      .json({ message: "Error fetching status", error: error.message });
  }
};

// Update Order Status (driver/admin use only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // only driver assigned to this order OR admin can update
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
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};
