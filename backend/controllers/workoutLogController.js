/**
 * Workout Log Controller
 * Handles CRUD operations for workout logs and exercise tracking
 */

const WorkoutLog = require('../models/WorkoutLog');
const { validationResult } = require('express-validator');

/**
 * @route   POST /api/workout-logs
 * @desc    Create a new workout log entry
 * @access  Private
 */
exports.createWorkoutLog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, exercises } = req.body;

    // Validate exercises array
    if (!exercises || exercises.length === 0) {
      return res.status(400).json({ message: 'At least one exercise is required' });
    }

    // Create workout log
    let workoutLog = new WorkoutLog({
      userId: req.user.userId,
      date: new Date(date),
      exercises,
    });

    // Save to database (pre-save hook will calculate total volume)
    await workoutLog.save();

    res.status(201).json({
      message: 'Workout log created successfully',
      workoutLog,
    });
  } catch (error) {
    console.error('Create workout log error:', error);
    res.status(500).json({ message: 'Server error creating workout log' });
  }
};

/**
 * @route   GET /api/workout-logs
 * @desc    Get all workout logs for authenticated user
 * @access  Private
 */
exports.getWorkoutLogs = async (req, res) => {
  try {
    const { startDate, endDate, limit = 20, page = 1 } = req.query;
    let query = { userId: req.user.userId };

    const toStartOfDayUTC = (value) => {
      const d = new Date(value);
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    };

    const toEndOfDayUTC = (value) => {
      const d = new Date(value);
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
    };

    // Filter by date range if provided (inclusive, UTC-normalized)
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = toStartOfDayUTC(startDate);
      }
      if (endDate) {
        query.date.$lte = toEndOfDayUTC(endDate);
      }
    }

    const skip = (page - 1) * limit;

    // Fetch logs with sorting and pagination
    const workoutLogs = await WorkoutLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Count total for pagination
    const total = await WorkoutLog.countDocuments(query);

    res.status(200).json({
      workoutLogs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get workout logs error:', error);
    res.status(500).json({ message: 'Server error retrieving workout logs' });
  }
};

/**
 * @route   GET /api/workout-logs/:id
 * @desc    Get a specific workout log
 * @access  Private
 */
exports.getWorkoutLogById = async (req, res) => {
  try {
    const workoutLog = await WorkoutLog.findById(req.params.id);

    if (!workoutLog) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    // Check ownership
    if (workoutLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to access this log' });
    }

    res.status(200).json({
      workoutLog,
    });
  } catch (error) {
    console.error('Get workout log error:', error);
    res.status(500).json({ message: 'Server error retrieving workout log' });
  }
};

/**
 * @route   PUT /api/workout-logs/:id
 * @desc    Update a workout log entry
 * @access  Private
 */
exports.updateWorkoutLog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let workoutLog = await WorkoutLog.findById(req.params.id);

    if (!workoutLog) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    // Check ownership
    if (workoutLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this log' });
    }

    const { exercises } = req.body;

    // Validate exercises if provided
    if (exercises) {
      if (exercises.length === 0) {
        return res.status(400).json({ message: 'At least one exercise is required' });
      }
      workoutLog.exercises = exercises;
    }

    // Save (pre-save hook will recalculate total volume)
    await workoutLog.save();

    res.status(200).json({
      message: 'Workout log updated successfully',
      workoutLog,
    });
  } catch (error) {
    console.error('Update workout log error:', error);
    res.status(500).json({ message: 'Server error updating workout log' });
  }
};

/**
 * @route   DELETE /api/workout-logs/:id
 * @desc    Delete a workout log entry
 * @access  Private
 */
exports.deleteWorkoutLog = async (req, res) => {
  try {
    const workoutLog = await WorkoutLog.findById(req.params.id);

    if (!workoutLog) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    // Check ownership
    if (workoutLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this log' });
    }

    // Delete
    await WorkoutLog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Workout log deleted successfully',
    });
  } catch (error) {
    console.error('Delete workout log error:', error);
    res.status(500).json({ message: 'Server error deleting workout log' });
  }
};

/**
 * @route   GET /api/workout-logs/stats/prs
 * @desc    Get personal records for date range
 * @access  Private
 */
exports.getPersonalRecords = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const prs = await WorkoutLog.getPRsByDateRange(req.user.userId, startDate, endDate);

    res.status(200).json({
      prs,
      count: prs.length,
    });
  } catch (error) {
    console.error('Get personal records error:', error);
    res.status(500).json({ message: 'Server error retrieving personal records' });
  }
};

/**
 * @route   GET /api/workout-logs/stats/volume
 * @desc    Get total volume by muscle group for date range
 * @access  Private
 */
exports.getVolumeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const volumeByMuscle = await WorkoutLog.getVolumeByMuscleGroup(
      req.user.userId,
      startDate,
      endDate
    );

    res.status(200).json({
      volumeByMuscle,
    });
  } catch (error) {
    console.error('Get volume stats error:', error);
    res.status(500).json({ message: 'Server error retrieving volume stats' });
  }
};

/**
 * @route   POST /api/workout-logs/:id/add-exercise
 * @desc    Add a single exercise to existing workout log
 * @access  Private
 */
exports.addExercise = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const workoutLog = await WorkoutLog.findById(req.params.id);

    if (!workoutLog) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    // Check ownership
    if (workoutLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to modify this log' });
    }

    const exercise = req.body;
    workoutLog.exercises.push(exercise);

    // Save (pre-save hook will recalculate total volume)
    await workoutLog.save();

    res.status(200).json({
      message: 'Exercise added successfully',
      workoutLog,
    });
  } catch (error) {
    console.error('Add exercise error:', error);
    res.status(500).json({ message: 'Server error adding exercise' });
  }
};

/**
 * @route   DELETE /api/workout-logs/:id/exercises/:exerciseIndex
 * @desc    Remove a single exercise from workout log
 * @access  Private
 */
exports.removeExercise = async (req, res) => {
  try {
    const workoutLog = await WorkoutLog.findById(req.params.id);

    if (!workoutLog) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    // Check ownership
    if (workoutLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to modify this log' });
    }

    const { exerciseIndex } = req.params;

    if (exerciseIndex < 0 || exerciseIndex >= workoutLog.exercises.length) {
      return res.status(400).json({ message: 'Invalid exercise index' });
    }

    workoutLog.exercises.splice(exerciseIndex, 1);

    // If no exercises remain, delete the entire workout log
    if (workoutLog.exercises.length === 0) {
      await WorkoutLog.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message: 'Workout log deleted (no exercises remaining)',
        deleted: true,
      });
    }

    // Save (pre-save hook will recalculate total volume)
    await workoutLog.save();

    res.status(200).json({
      message: 'Exercise removed successfully',
      workoutLog,
    });
  } catch (error) {
    console.error('Remove exercise error:', error);
    res.status(500).json({ message: 'Server error removing exercise' });
  }
};
