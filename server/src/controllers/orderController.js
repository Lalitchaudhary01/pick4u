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

    if (!pickupAddress || !dropAddress || !packageWeight) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const weightNum = parseFloat(packageWeight);

    let distance = null;
    try {
      distance = await getDistanceInKm(pickupAddress, dropAddress);
    } catch (err) {
      console.warn("Google Maps API failed, fallback to 10km");
      distance = 10;
    }

    const fare = calculateFare(distance, weightNum, deliveryType);

    const order = await Order.create({
      customer: req.user?.id,
      pickupAddress,
      dropAddress,
      packageWeight: weightNum,
      deliveryType,
      couponCode,
      fare,
      distance,
      status: "pending",
    });

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.error("createOrder:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
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
    console.error("getMyOrders:", error);
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
    console.error("getOrderById:", error);
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
    console.error("getOrderStatus:", error);
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

    // Notify customer via socket
    const io = req.app.get("io");
    if (io) {
      io.to(`user_${order.customer}`).emit("order-status-update", {
        orderId: order._id,
        status,
      });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("updateOrderStatus:", error);
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

    // Emit to driver
    const io = req.app.get("io");
    if (io && driverId) {
      io.to(`driver_${driverId}`).emit("new-order", {
        orderId: order._id,
        pickup: order.pickupAddress,
        drop: order.dropAddress,
      });
    }

    res.json({ success: true, message: "Driver assigned", order });
  } catch (error) {
    console.error("assignDriver:", error);
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

    const io = req.app.get("io");
    if (io) {
      io.to(`user_${order.customer}`).emit("order-status-update", {
        orderId: order._id,
        status: "accepted",
      });
      io.to(`driver_${req.user._id}`).emit("order-accepted", {
        orderId: order._id,
      });
    }

    res.json({ success: true, message: "Order accepted", order });
  } catch (error) {
    console.error("acceptOrder:", error);
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

    const io = req.app.get("io");
    if (io) {
      io.to(`user_${order.customer}`).emit("order-status-update", {
        orderId: order._id,
        status: "rejected",
      });
    }

    res.json({ success: true, message: "Order rejected", order });
  } catch (error) {
    console.error("rejectOrder:", error);
    res
      .status(500)
      .json({ message: "Error rejecting order", error: error.message });
  }
};

// ------------------- Driver Updates Live Location -------------------
export const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.assignedDriver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.driverLocation = { lat, lng };
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`user_${order.customer}`).emit("driver-location-update", {
        orderId: order._id,
        lat,
        lng,
      });
    }

    res.json({ success: true, message: "Driver location updated" });
  } catch (error) {
    console.error("updateDriverLocation:", error);
    res
      .status(500)
      .json({ message: "Error updating location", error: error.message });
  }
};
