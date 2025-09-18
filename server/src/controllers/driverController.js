import User from "../models/User.js";

// Upload KYC Documents
export const uploadKYC = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware se user attach hoga
    const files = req.files; // uploadMiddleware se attach hoga

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const kycUrls = files.map((file) => file.path); // ya file.url agar Cloudinary
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.driverDetails.kycDocs.push(...kycUrls);
    user.driverDetails.kycStatus = "pending"; // Reset status after upload
    await user.save();

    res.status(200).json({ message: "KYC documents uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while uploading KYC" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware se attach hoga
    const user = await User.findById(userId)
      .select("-password") // password exclude
      .lean();

    if (!user) return res.status(404).json({ message: "Driver not found" });

    // Optional: populate recent orders if you have separate Order model
    // import Order from "../models/Order.js";
    // const orders = await Order.find({ driverId: userId }).sort({ createdAt: -1 }).limit(5);
    // user.orders = orders;

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching driver profile" });
  }
};
