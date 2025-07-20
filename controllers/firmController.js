const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

// ✅ Setup Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Image folder
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

const upload = multer({ storage });

// ✅ Add firm
const addFirmHandler = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.firm.length > 0) {
            return res.status(400).json({ message: "Vendor can have only one firm" });
        }

        const newFirm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await newFirm.save();

        vendor.firm.push(savedFirm._id);
        await vendor.save();

        return res.status(200).json({
            message: "Firm added successfully",
            firmId: savedFirm._id,
            vendorFirmName: savedFirm.firmName
        });

    } catch (error) {
        console.error("Error adding firm:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Delete firm
const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deleted = await Firm.findByIdAndDelete(firmId);
        if (!deleted) {
            return res.status(404).json({ error: "No firm found" });
        }
        return res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error("Error deleting firm:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Export with multer upload inlined
module.exports = {
    addFirm: [upload.single('image'), addFirmHandler],
    deleteFirmById
};
