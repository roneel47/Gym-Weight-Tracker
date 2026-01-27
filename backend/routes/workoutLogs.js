/**
 * Workout Log Routes
 * Endpoints for creating, reading, updating, and deleting workout logs
 */

const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createWorkoutLog,
  getWorkoutLogs,
  getWorkoutLogById,
  updateWorkoutLog,
  deleteWorkoutLog,
  getPersonalRecords,
  getVolumeStats,
  addExercise,
  removeExercise,
} = require('../controllers/workoutLogController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Reusable exercise validation
const exerciseValidation = [
  body('exerciseName', 'Exercise name is required').trim().notEmpty().isLength({ max: 100 }),
  body('muscleGroup', 'Valid muscle group is required').isIn([
    'Back',
    'Biceps',
    'Legs',
    'Shoulders',
    'Chest',
    'Triceps',
    'Forearms',
    'Calves',
    'Abs',
    'Other',
  ]),
  body('sets', 'Sets must be an integer between 1-10').isInt({ min: 1, max: 10 }),
  body('reps', 'Reps must be an integer between 1-100').isInt({ min: 1, max: 100 }),
  body('weightUsed', 'Weight must be a number between 0-500 kg').isFloat({ min: 0, max: 500 }),
  body('personalRecord', 'Personal record must be a boolean').optional().isBoolean(),
  body('notes', 'Notes must not exceed 300 characters').optional().isLength({ max: 300 }),
];

/**
 * POST /api/workout-logs
 * Create a new workout log with exercises
 */
router.post(
  '/',
  [
    body('date', 'Date is required').notEmpty().isISO8601(),
    body('exercises', 'Exercises array is required').isArray({ min: 1 }),
    body('exercises.*.exerciseName', 'Each exercise must have a name').trim().notEmpty(),
    body('exercises.*.muscleGroup', 'Each exercise must have a muscle group').isIn([
      'Back',
      'Biceps',
      'Legs',
      'Shoulders',
      'Chest',
      'Triceps',
      'Forearms',
      'Calves',
      'Abs',
      'Other',
    ]),
    body('exercises.*.sets', 'Sets must be integer 1-10').isInt({ min: 1, max: 10 }),
    body('exercises.*.reps', 'Reps must be integer 1-100').isInt({ min: 1, max: 100 }),
    body('exercises.*.weightUsed', 'Weight must be 0-500 kg').isFloat({ min: 0, max: 500 }),
    body('exercises.*.personalRecord').optional().isBoolean(),
  ],
  createWorkoutLog
);

/**
 * GET /api/workout-logs
 * Get all workout logs for authenticated user
 * Query params: startDate, endDate, limit, page
 */
router.get('/', getWorkoutLogs);

/**
 * GET /api/workout-logs/stats/prs
 * Get personal records for date range
 * Query params: startDate, endDate (required)
 */
router.get('/stats/prs', getPersonalRecords);

/**
 * GET /api/workout-logs/stats/volume
 * Get total volume by muscle group for date range
 * Query params: startDate, endDate (required)
 */
router.get('/stats/volume', getVolumeStats);

/**
 * GET /api/workout-logs/:id
 * Get a specific workout log
 */
router.get('/:id', getWorkoutLogById);

/**
 * PUT /api/workout-logs/:id
 * Update a workout log (replace exercises array)
 */
router.put('/:id', [body('exercises').optional().isArray({ min: 1 })], updateWorkoutLog);

/**
 * POST /api/workout-logs/:id/add-exercise
 * Add a single exercise to existing workout log
 */
router.post('/:id/add-exercise', exerciseValidation, addExercise);

/**
 * DELETE /api/workout-logs/:id/exercises/:exerciseIndex
 * Remove a single exercise from workout log
 */
router.delete('/:id/exercises/:exerciseIndex', removeExercise);

/**
 * DELETE /api/workout-logs/:id
 * Delete entire workout log
 */
router.delete('/:id', deleteWorkoutLog);

module.exports = router;
