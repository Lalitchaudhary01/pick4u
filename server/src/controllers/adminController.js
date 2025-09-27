// server/src/controllers/adminController.js
import User from "../models/User.js";
import Order from "../models/Order.js";
// if you have a separate Driver model, import it; otherwise we'll fallback to User with role 'driver'
import Driver from "../models/Driver.js"; // optional; if file not present, ignore (see below)

/**
 * Get aggregated stats for admin dashboard
 * GET /api/admin/stats
 */
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    // drivers: either Driver collection or Users with role driver
    let totalDrivers = 0;
    try {
      totalDrivers = await Driver.countDocuments();
    } catch (err) {
      totalDrivers = await User.countDocuments({ role: "driver" });
    }
    const totalOrders = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $match: { status: "Delivered", fare: { $exists: true } } },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    res.json({ totalUsers, totalDrivers, totalOrders, revenue });
  } catch (err) {
    console.error("getStats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all users (customers)
 * GET /api/admin/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("getUsers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Block / Unblock a user
 * PUT /api/admin/users/:id/block
 * body: { isBlocked: true/false }   // optional - if missing toggles
 */
export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isBlocked } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked =
      typeof isBlocked === "boolean" ? isBlocked : !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (err) {
    console.error("blockUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get drivers list
 * GET /api/admin/drivers
 */
export const getDrivers = async (req, res) => {
  try {
    // Prefer Driver model if present, else query User with role='driver'
    let drivers = [];
    try {
      drivers = await Driver.find().select("-password").sort({ createdAt: -1 });
    } catch (err) {
      drivers = await User.find({ role: "driver" })
        .select("-password")
        .sort({ createdAt: -1 });
    }
    res.json(drivers);
  } catch (err) {
    console.error("getDrivers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Approve / Reject driver KYC
 * PUT /api/admin/drivers/:id/approve
 * PUT /api/admin/drivers/:id/reject
 */
export const approveDriver = async (req, res) => {
  try {
    const id = req.params.id;
    let driver;
    try {
      driver = await Driver.findById(id);
      if (!driver) throw new Error("no-driver-model-or-not-found");
      driver.kycStatus = "approved";
      await driver.save();
    } catch (err) {
      // fallback to User model
      driver = await User.findById(id);
      if (!driver || driver.role !== "driver")
        return res.status(404).json({ message: "Driver not found" });
      driver.kycStatus = "approved";
      await driver.save();
    }
    res.json({ message: "Driver approved", driver });
  } catch (err) {
    console.error("approveDriver:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectDriver = async (req, res) => {
  try {
    const id = req.params.id;
    let driver;
    try {
      driver = await Driver.findById(id);
      if (!driver) throw new Error("no-driver-model-or-not-found");
      driver.kycStatus = "rejected";
      await driver.save();
    } catch (err) {
      driver = await User.findById(id);
      if (!driver || driver.role !== "driver")
        return res.status(404).json({ message: "Driver not found" });
      driver.kycStatus = "rejected";
      await driver.save();
    }
    res.json({ message: "Driver rejected", driver });
  } catch (err) {
    console.error("rejectDriver:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Orders list with optional filter query params
 * GET /api/admin/orders?status=Pending&page=1&limit=50
 */
export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;
    const q = {};
    if (status) q.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(q)
      .populate("customer", "name email")
      .populate("assignedDriver", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json(orders);
  } catch (err) {
    console.error("getOrders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Assign driver to order
 * PUT /api/admin/orders/:id/assign
 * body: { driverId: "<id>" }
 */
export const assignDriverToOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { driverId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.assignedDriver = driverId;
    order.status = "Assigned";
    await order.save();

    // emit socket if io available on app (optional)
    const io = req.app.get("io");
    if (io && driverId) {
      io.to(`driver_${driverId}`).emit("new-order", {
        orderId: order._id,
        pickup: order.pickupAddress,
      });
    }

    res.json({ message: "Driver assigned", order });
  } catch (err) {
    console.error("assignDriverToOrder:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Cancel order
 * PUT /api/admin/orders/:id/cancel
 */
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Cancelled";
    await order.save();

    // notify assigned driver/customer if needed
    const io = req.app.get("io");
    if (io && order.assignedDriver) {
      io.to(`driver_${order.assignedDriver}`).emit("order-updated", {
        _id: order._id,
        status: "Cancelled",
      });
    }

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    console.error("cancelOrder:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get earnings per driver (aggregation)
 * GET /api/admin/earnings
 * returns array: [{ driverId, driverName, totalOrders, earnings }]
 */
export const getEarnings = async (req, res) => {
  try {
    const agg = await Order.aggregate([
      {
        $match: {
          assignedDriver: { $exists: true, $ne: null },
          status: "Delivered",
          fare: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$assignedDriver",
          totalOrders: { $sum: 1 },
          earnings: { $sum: "$fare" },
        },
      },
      { $sort: { earnings: -1 } },
    ]);

    // populate driver names (Driver model or User)
    const results = await Promise.all(
      agg.map(async (row) => {
        let driverName = "Unknown";
        try {
          const d = await Driver.findById(row._id).select("name");
          if (d) driverName = d.name;
          else {
            const u = await User.findById(row._id).select("name");
            if (u) driverName = u.name;
          }
        } catch (e) {
          // ignore
        }
        return {
          driverId: row._id,
          driverName,
          totalOrders: row.totalOrders,
          earnings: row.earnings,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("getEarnings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Reports / CSV export (simple stub)
 * GET /api/admin/reports?type=orders&from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export const getReports = async (req, res) => {
  try {
    const { type = "orders", from, to } = req.query;

    if (type === "orders") {
      const q = {};
      if (from || to) {
        q.createdAt = {};
        if (from) q.createdAt.$gte = new Date(from);
        if (to) q.createdAt.$lte = new Date(to);
      }
      const orders = await Order.find(q).populate("customer assignedDriver");
      // send raw JSON for now; frontend can convert to CSV
      return res.json({ type: "orders", data: orders });
    }

    res.json({ message: "Report type not implemented" });
  } catch (err) {
    console.error("getReports:", err);
    res.status(500).json({ message: "Server error" });
  }
};

