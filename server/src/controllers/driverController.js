import Driver from "../models/Driver.js";

// Upload KYC
export const kycUploadController = async (req, res) => {
  try {
    const files = req.files.map((file) => file.path);

    let driver = await Driver.findOne({ user: req.user.id });
    if (!driver) {
      driver = new Driver({
        user: req.user.id,
        kycDocs: files,
        kycStatus: "PENDING",
      });
    } else {
      driver.kycDocs = files;
      driver.kycStatus = "PENDING";
    }

    await driver.save();
    res.json({ message: "KYC uploaded successfully", driver });
  } catch (err) {
    res.status(500).json({ message: "KYC upload failed", error: err.message });
  }
};

// Get driver profile
export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id }).populate(
      "user",
      "name email phone role"
    );
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch driver profile", error: err.message });
  }
};

// Get earnings
export const getDriverEarnings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ total: driver.earnings });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch earnings", error: err.message });
  }
};
