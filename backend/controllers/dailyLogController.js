/**
 * Daily Log Controller
 * Handles CRUD operations for daily log entries
 */

const DailyLog = require('../models/DailyLog');
const { validationResult } = require('express-validator');

/**
 * @route   POST /api/daily-logs
 * @desc    Create a new daily log entry
 * @access  Private
 */
exports.createDailyLog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, weight, eggsConsumed, gymAttendance, creatineIntake, energyLevel, strengthInGym, notes } =
      req.body;

    // Create daily log with user ID from auth middleware
    let dailyLog = new DailyLog({
      userId: req.user.userId,
      date: new Date(date),
      weight,
      eggsConsumed,
      gymAttendance,
      creatineIntake,
      energyLevel,
      strengthInGym,
      notes,
    });

    // Populate calculated fields
    await dailyLog.populateCalculatedFields();

    // Save to database
    await dailyLog.save();

    res.status(201).json({
      message: 'Daily log created successfully',
      dailyLog,
    });
  } catch (error) {
    console.error('Create daily log error:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: 'Entry already exists for this date' });
    }
    res.status(500).json({ message: 'Server error creating daily log' });
  }
};

/**
 * @route   GET /api/daily-logs
 * @desc    Get all daily logs for authenticated user
 * @access  Private
 */
exports.getDailyLogs = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30, page = 1 } = req.query;
    let query = { userId: req.user.userId };

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    // Fetch logs with sorting and pagination
    const dailyLogs = await DailyLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Count total for pagination
    const total = await DailyLog.countDocuments(query);

    // Populate calculated fields for each log
    for (let log of dailyLogs) {
      await log.populateCalculatedFields();
    }

    res.status(200).json({
      logs: dailyLogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error('Get daily logs error:', error);
    res.status(500).json({ message: 'Server error retrieving daily logs' });
  }
};

/**
 * @route   GET /api/daily-logs/:id
 * @desc    Get a specific daily log entry
 * @access  Private
 */
exports.getDailyLogById = async (req, res) => {
  try {
    const dailyLog = await DailyLog.findById(req.params.id);

    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }

    // Check ownership
    if (dailyLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to access this log' });
    }

    // Populate calculated fields
    await dailyLog.populateCalculatedFields();

    res.status(200).json({
      dailyLog,
    });
  } catch (error) {
    console.error('Get daily log error:', error);
    res.status(500).json({ message: 'Server error retrieving daily log' });
  }
};

/**
 * @route   PUT /api/daily-logs/:id
 * @desc    Update a daily log entry
 * @access  Private
 */
exports.updateDailyLog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let dailyLog = await DailyLog.findById(req.params.id);

    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }

    // Check ownership
    if (dailyLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this log' });
    }

    // Update fields
    const { weight, eggsConsumed, gymAttendance, creatineIntake, energyLevel, strengthInGym, notes } = req.body;

    if (weight !== undefined) dailyLog.weight = weight;
    if (eggsConsumed !== undefined) dailyLog.eggsConsumed = eggsConsumed;
    if (gymAttendance !== undefined) dailyLog.gymAttendance = gymAttendance;
    if (creatineIntake !== undefined) dailyLog.creatineIntake = creatineIntake;
    if (energyLevel !== undefined) dailyLog.energyLevel = energyLevel;
    if (strengthInGym !== undefined) dailyLog.strengthInGym = strengthInGym;
    if (notes !== undefined) dailyLog.notes = notes;

    // Populate calculated fields
    await dailyLog.populateCalculatedFields();

    // Save
    await dailyLog.save();

    res.status(200).json({
      message: 'Daily log updated successfully',
      dailyLog,
    });
  } catch (error) {
    console.error('Update daily log error:', error);
    res.status(500).json({ message: 'Server error updating daily log' });
  }
};

/**
 * @route   DELETE /api/daily-logs/:id
 * @desc    Delete a daily log entry
 * @access  Private
 */
exports.deleteDailyLog = async (req, res) => {
  try {
    const dailyLog = await DailyLog.findById(req.params.id);

    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }

    // Check ownership
    if (dailyLog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this log' });
    }

    // Delete
    await DailyLog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Daily log deleted successfully',
    });
  } catch (error) {
    console.error('Delete daily log error:', error);
    res.status(500).json({ message: 'Server error deleting daily log' });
  }
};

/**
 * @route   GET /api/daily-logs/stats/weekly
 * @desc    Get weekly statistics for user
 * @access  Private
 */
exports.getWeeklyStats = async (req, res) => {
  try {
    const { weekStart } = req.query;
    const startDate = weekStart ? new Date(weekStart) : new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week (Sunday)

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // End of week (Saturday)

    const logs = await DailyLog.find({
      userId: req.user.userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    // Calculate stats
    const gymDays = logs.filter((log) => log.gymAttendance).length;
    const creatineDays = logs.filter((log) => log.creatineIntake).length;
    const avgEnergy = logs.length > 0 ? (logs.reduce((sum, log) => sum + (log.energyLevel || 0), 0) / logs.length).toFixed(2) : 0;
    const avgStrength = logs.length > 0 ? (logs.reduce((sum, log) => sum + (log.strengthInGym || 0), 0) / logs.length).toFixed(2) : 0;

    let weightGain = null;
    if (logs.length > 0) {
      const firstWeight = logs[0].weight;
      const lastWeight = logs[logs.length - 1].weight;
      weightGain = (lastWeight - firstWeight).toFixed(2);
    }

    res.status(200).json({
      weekStart,
      logs,
      stats: {
        daysLogged: logs.length,
        gymDays,
        creatineDays,
        avgEnergy,
        avgStrength,
        weightGain,
      },
    });
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ message: 'Server error retrieving weekly stats' });
  }
};
