const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// User profile routes - authenticated users
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);

// Admin routes - only admins can access these
router.get('/', authenticate, requireAdmin, userController.getUsers);
router.delete('/:userId', authenticate, requireAdmin, userController.deleteUser);
router.put('/:userId/ban', authenticate, requireAdmin, userController.toggleUserBan);

module.exports = router;