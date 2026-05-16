const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', orderController.createOrder);
router.post('/verify-payment', orderController.verifyPayment);

router.get('/my', protect, orderController.getMyOrders);
router.get('/', protect, admin, orderController.getAllOrders);
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

module.exports = router;
