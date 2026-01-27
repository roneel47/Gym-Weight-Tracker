const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// @route   GET /api/analytics/weekly
// @desc    Get weekly summary
// @access  Private
router.get('/weekly', analyticsController.getWeeklySummary);

// @route   GET /api/analytics/monthly
// @desc    Get monthly summary
// @access  Private
router.get('/monthly', analyticsController.getMonthlySummary);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard stats
// @access  Private
router.get('/dashboard', analyticsController.getDashboardStats);

// @route   GET /api/analytics/creatine
// @desc    Get creatine comparison
// @access  Private
router.get('/creatine', analyticsController.getCreatineComparison);

module.exports = router;
