const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

// Reviews routes (nested under products)
router.get('/:id/reviews', reviewController.getProductReviews);
router.post('/:id/reviews', protect, reviewController.createProductReview);

module.exports = router;
