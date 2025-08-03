const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Client', 'Freelancer', 'Admin']).withMessage('Valid role is required (Client, Freelancer, or Admin)')
  ],
  authController.register
);

router.post('/login', authController.login);

module.exports = router;