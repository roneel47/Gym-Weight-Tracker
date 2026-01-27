/**
 * Authentication Routes
 * Endpoints for user registration, login, and profile
 */

const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { register, login, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user with validation
 */
router.post(
  '/register',
  [
    body('email', 'Please provide a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('name', 'Name is required').trim().notEmpty(),
  ],
  register
);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  '/login',
  [
    body('email', 'Please provide a valid email').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  login
);

/**
 * GET /api/auth/me
 * Get current authenticated user (requires JWT token)
 */
router.get('/me', auth, getCurrentUser);

module.exports = router;
