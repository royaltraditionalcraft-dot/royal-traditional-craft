const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateMe);

router.get('/users', protect, admin, authController.getAllUsers);

module.exports = router;
