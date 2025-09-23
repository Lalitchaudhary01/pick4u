import Order from "../models/Order.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { pickup, dropoff, packageDetails, weight, serviceType, notes } =
      req.body;

    const order = new Order({
      user: req.user._id,
      pickup,
      dropoff,
      packageDetails,
      weight,
      serviceType,
      notes,
      status: "pending",
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

// Get logged in user’s orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Track specific order
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "driver",
      "name phone"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error tracking order" });
  }
};
