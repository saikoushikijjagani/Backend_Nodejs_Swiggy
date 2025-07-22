const Vendor = require("../models/vendorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /vendor/register
const vendorRegister = async (req, res) => {
  try {
    const { username, email, password, firm } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
      firm,
    });

    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.error("Error registering vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /vendor/login
const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { vendorId: vendor._id, firm: vendor.firm },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, vendor });
  } catch (error) {
    console.error("Error logging in vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /vendor/all-vendors
const getAllVendors = async (req, res) => {
  try {
    const order = req.query.order === "desc" ? -1 : 1;
    const vendors = await Vendor.find().sort({ createdAt: order });

    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /vendor/single-vendor/:apple
const getVendorById = async (req, res) => {
  try {
    const { apple } = req.params;
    const vendor = await Vendor.findById(apple).populate("firm");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  vendorRegister,
  vendorLogin,
  getAllVendors,
  getVendorById,
};
