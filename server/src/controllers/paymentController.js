import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { createOnlinePayment } from "../services/paymentService.js";

// Create Payment
export const createPayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    let payment;
    if (method === "cod") {
      // COD = mark as pending (paid on delivery)
      payment = await Payment.create({
        order: order._id,
        customer: req.user.id,
        method,
        amount: order.fare,
        status: "pending",
      });
    } else {
      // Online = call payment gateway (stub for now)
      const onlineTxn = await createOnlinePayment(order);
      payment = await Payment.create({
        order: order._id,
        customer: req.user.id,
        method,
        amount: order.fare,
        status: "pending", // until callback confirms
      });
    }

    res.json({ message: "Payment created", payment });
  } catch (error) {
    res.status(500).json({ message: "Payment error", error: error.message });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user.id })
      .populate("order", "pickupAddress dropAddress fare status")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payments", error: error.message });
  }
};
