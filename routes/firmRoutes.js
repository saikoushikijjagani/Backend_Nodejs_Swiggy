const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
const path = require('path');

const router = express.Router();

// ✅ Route to add firm with image upload (verifyToken middleware + image upload logic handled inside controller)
router.post('/add-firm', verifyToken, ...firmController.addFirm);

// ✅ Serve uploaded images (used by frontend <img> tag)
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

// ✅ Delete firm
router.delete('/:firmId', firmController.deleteFirmById);

module.exports = router;
