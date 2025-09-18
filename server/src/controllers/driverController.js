import User from "../models/User.js";
import logger from "../config/logger.js";

// @desc    Upload KYC documents
// @route   POST /api/drivers/kyc-upload
// @access  Private (driver)
export const kycUploadController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Get uploaded file URLs from Cloudinary
    const kycUrls = req.files.map((file) => file.path); // multer-cloudinary stores URL in file.path

    // Update driverDetails in User schema
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "driver") {
      return res.status(404).json({ message: "Driver not found" });
    }

    user.driverDetails.kycDocs = kycUrls;
    user.driverDetails.kycStatus = "pending"; // reset status on new upload
    await user.save();

    logger.info(`Driver ${user._id} uploaded KYC documents`);

    res.status(200).json({
      message: "KYC documents uploaded successfully",
      kycDocs: kycUrls,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
