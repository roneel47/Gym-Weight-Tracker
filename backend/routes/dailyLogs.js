/**
 * Daily Log Routes
 * Endpoints for creating, reading, updating, and deleting daily logs
 */

const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createDailyLog,
  getDailyLogs,
  getDailyLogById,
  updateDailyLog,
  deleteDailyLog,
  getWeeklyStats,
} = require('../controllers/dailyLogController');

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * POST /api/daily-logs
 * Create a new daily log entry
 */
router.post(
  '/',
  [
    body('date', 'Date is required').notEmpty().isISO8601(),
    body('weight', 'Weight is required and must be a number').isFloat({ min: 0, max: 200 }),
    body('eggsConsumed', 'Eggs must be an integer between 0-50').isInt({ min: 0, max: 50 }),
    body('gymAttendance', 'Gym attendance must be a boolean').optional().isBoolean(),
    body('creatineIntake', 'Creatine intake must be a boolean').optional().isBoolean(),
    body('energyLevel', 'Energy level must be an integer between 1-5').optional().isInt({ min: 1, max: 5 }),
    body('strengthInGym', 'Strength must be an integer between 1-5').optional().isInt({ min: 1, max: 5 }),
    body('notes', 'Notes must not exceed 500 characters').optional().isLength({ max: 500 }),
  ],
  createDailyLog
);

/**
 * GET /api/daily-logs
 * Get all daily logs for authenticated user (with optional filtering)
 * Query params: startDate, endDate, limit, page
 */
router.get('/', getDailyLogs);

/**
 * GET /api/daily-logs/stats/weekly
 * Get weekly statistics for user
 * Query params: weekStart (optional ISO date)
 */
router.get('/stats/weekly', getWeeklyStats);

/**
 * GET /api/daily-logs/:id
 * Get a specific daily log entry
 */
router.get('/:id', getDailyLogById);

/**
 * PUT /api/daily-logs/:id
 * Update a daily log entry
 */
router.put(
  '/:id',
  [
    body('weight', 'Weight must be a number between 0-200').optional().isFloat({ min: 0, max: 200 }),
    body('eggsConsumed', 'Eggs must be an integer between 0-50').optional().isInt({ min: 0, max: 50 }),
    body('gymAttendance', 'Gym attendance must be a boolean').optional().isBoolean(),
    body('creatineIntake', 'Creatine intake must be a boolean').optional().isBoolean(),
    body('energyLevel', 'Energy level must be an integer between 1-5').optional().isInt({ min: 1, max: 5 }),
    body('strengthInGym', 'Strength must be an integer between 1-5').optional().isInt({ min: 1, max: 5 }),
    body('notes', 'Notes must not exceed 500 characters').optional().isLength({ max: 500 }),
  ],
  updateDailyLog
);

/**
 * DELETE /api/daily-logs/:id
 * Delete a daily log entry
 */
router.delete('/:id', deleteDailyLog);

module.exports = router;
