const express = require('express');
const path = require('path');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductByFirm);
router.delete('/:productId', productController.deleteProductById);

// ✅ Serve product image by name
router.get('/uploads/:imageName', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'uploads', req.params.imageName);
  res.sendFile(imagePath);
});

module.exports = router;
