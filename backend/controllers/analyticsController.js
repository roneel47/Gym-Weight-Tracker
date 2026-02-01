const DailyLog = require('../models/DailyLog');
const WorkoutLog = require('../models/WorkoutLog');

/**
 * Get weekly summary for a user
 * GET /api/analytics/weekly?startDate=2025-01-01&endDate=2025-01-07
 */
exports.getWeeklySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const dailyLogs = await DailyLog.find({
      userId: req.user.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 }); // Sort by date ascending

    if (dailyLogs.length === 0) {
      return res.json({
        startWeight: 0,
        endWeight: 0,
        totalGain: 0,
        avgEggs: 0,
        gymDays: 0,
        creatineDays: 0,
        avgEnergy: 0,
        avgStrength: 0,
        status: 'No data',
      });
    }

    // Ensure logs are sorted by date - Use first and last log by date
    const sortedLogs = dailyLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const startWeight = sortedLogs[0].weight;
    const endWeight = sortedLogs[sortedLogs.length - 1].weight;
    const totalGain = endWeight - startWeight;

    const totalEggs = dailyLogs.reduce((sum, log) => sum + log.eggsConsumed, 0);
    const avgEggs = totalEggs / dailyLogs.length;

    const gymDays = dailyLogs.filter((log) => log.gymAttendance).length;
    const creatineDays = dailyLogs.filter((log) => log.creatineIntake).length;

    const totalEnergy = dailyLogs.reduce((sum, log) => sum + log.energyLevel, 0);
    const avgEnergy = totalEnergy / dailyLogs.length;

    const totalStrength = dailyLogs.reduce((sum, log) => sum + log.strengthInGym, 0);
    const avgStrength = totalStrength / dailyLogs.length;

    // Determine status based on weekly gain (target: 0.5-1 kg/week)
    let status = 'On Track';
    if (totalGain < 0.3) {
      status = 'Too Slow';
    } else if (totalGain > 1.2) {
      status = 'Too Fast';
    } else if (totalGain < 0) {
      status = 'Dropping';
    }

    res.json({
      startWeight: startWeight.toFixed(1),
      endWeight: endWeight.toFixed(1),
      totalGain: totalGain.toFixed(2),
      avgEggs: avgEggs.toFixed(1),
      gymDays,
      creatineDays,
      avgEnergy: avgEnergy.toFixed(1),
      avgStrength: avgStrength.toFixed(1),
      status,
    });
  } catch (err) {
    console.error('Error in getWeeklySummary:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get monthly summary for a user
 * GET /api/analytics/monthly?month=1&year=2025
 */
exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Get first and last day of month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);

    const dailyLogs = await DailyLog.find({
      userId: req.user.userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 }); // Sort by date ascending

    if (dailyLogs.length === 0) {
      return res.json({
        startWeight: 0,
        endWeight: 0,
        monthlyGain: 0,
        avgWeeklyGain: 0,
        gymConsistency: 0,
        creatineUsage: 0,
        totalDays: 0,
      });
    }

    // Ensure logs are sorted by date - Use first and last log by date
    const sortedLogs = dailyLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const startWeight = sortedLogs[0].weight;
    const endWeight = sortedLogs[sortedLogs.length - 1].weight;
    const monthlyGain = endWeight - startWeight;

    // Calculate average weekly gain based on actual days
    const daysInMonth = dailyLogs.length;
    const weeksInMonth = daysInMonth / 7;
    const avgWeeklyGain = weeksInMonth > 0 ? monthlyGain / weeksInMonth : 0;

    // Calculate gym consistency percentage
    const gymDays = dailyLogs.filter((log) => log.gymAttendance).length;
    const gymConsistency = (gymDays / daysInMonth) * 100;

    // Calculate creatine usage percentage
    const creatineDays = dailyLogs.filter((log) => log.creatineIntake).length;
    const creatineUsage = (creatineDays / daysInMonth) * 100;

    res.json({
      startWeight: startWeight.toFixed(1),
      endWeight: endWeight.toFixed(1),
      monthlyGain: monthlyGain.toFixed(2),
      avgWeeklyGain: avgWeeklyGain.toFixed(2),
      gymConsistency: gymConsistency.toFixed(1),
      creatineUsage: creatineUsage.toFixed(1),
      totalDays: daysInMonth,
    });
  } catch (err) {
    console.error('Error in getMonthlySummary:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get dashboard stats for a user
 * GET /api/analytics/dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get recent daily logs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyLogs = await DailyLog.find({
      userId: req.user.userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 }); // Sort by date descending (most recent first)

    if (dailyLogs.length === 0) {
      return res.json({
        currentWeight: 0,
        sevenDayAvg: 0,
        trend: 'Stable',
        gymConsistency: 0,
        totalPRs: 0,
        avgEnergy: 0,
        avgStrength: 0,
        progressToTarget: 0,
      });
    }

    // Current weight is the most recent log (first in descending order)
    const currentWeight = dailyLogs[0].weight;

    // Calculate 7-day average
    const last7Days = dailyLogs.slice(0, Math.min(7, dailyLogs.length));
    const sevenDaySum = last7Days.reduce((sum, log) => sum + log.weight, 0);
    const sevenDayAvg = sevenDaySum / last7Days.length;

    // Determine trend
    let trend = 'Stable';
    if (dailyLogs.length > 1) {
      const previousWeight = dailyLogs[1].weight;
      const change = currentWeight - previousWeight;
      if (change > 0.2) {
        trend = 'Going Up';
      } else if (change < -0.2) {
        trend = 'Dropping';
      }
    }

    // Calculate gym consistency (last 30 days)
    const gymDays = dailyLogs.filter((log) => log.gymAttendance).length;
    const gymConsistency = (gymDays / dailyLogs.length) * 100;

    // Get total PRs from workout logs
    const workoutLogs = await WorkoutLog.find({ userId: req.user.userId });
    let totalPRs = 0;
    workoutLogs.forEach((workout) => {
      totalPRs += workout.exercises.filter((ex) => ex.personalRecord).length;
    });

    // Calculate avg energy and strength
    const totalEnergy = dailyLogs.reduce((sum, log) => sum + log.energyLevel, 0);
    const avgEnergy = totalEnergy / dailyLogs.length;

    const totalStrength = dailyLogs.reduce((sum, log) => sum + log.strengthInGym, 0);
    const avgStrength = totalStrength / dailyLogs.length;

    // Calculate progress toward target (60 kg)
    const targetWeight = 60;
    const startWeight = 50; // Assuming starting weight
    const progressToTarget = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;

    res.json({
      currentWeight: currentWeight.toFixed(1),
      sevenDayAvg: sevenDayAvg.toFixed(1),
      trend,
      gymConsistency: gymConsistency.toFixed(1),
      totalPRs,
      avgEnergy: avgEnergy.toFixed(1),
      avgStrength: avgStrength.toFixed(1),
      progressToTarget: Math.min(100, progressToTarget.toFixed(1)),
    });
  } catch (err) {
    console.error('Error in getDashboardStats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get creatine comparison stats
 * GET /api/analytics/creatine?startDate=2025-01-15
 */
exports.getCreatineComparison = async (req, res) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ message: 'Creatine start date is required' });
    }

    const creatineStartDate = new Date(startDate);

    // Get all daily logs sorted by date ascending
    const allLogs = await DailyLog.find({
      userId: req.user.userId,
    }).sort({ date: 1 }); // Sort ascending

    // Split into pre and post creatine
    const preCreatine = allLogs.filter((log) => log.date < creatineStartDate);
    const postCreatine = allLogs.filter((log) => log.date >= creatineStartDate);

    // Helper function to calculate stats
    const calculateStats = (logs) => {
      if (logs.length === 0) {
        return {
          weightGainSpeed: 0,
          avgStrength: 0,
          avgEnergy: 0,
          prCount: 0,
          gymConsistency: 0,
        };
      }

      // Ensure sorted by date
      const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
      const startWeight = sortedLogs[0].weight;
      const endWeight = sortedLogs[sortedLogs.length - 1].weight;
      const totalGain = endWeight - startWeight;
      const daysCount = logs.length;
      const weightGainSpeed = daysCount > 0 ? (totalGain / daysCount) * 7 : 0; // Per week

      const totalStrength = logs.reduce((sum, log) => sum + log.strengthInGym, 0);
      const avgStrength = totalStrength / logs.length;

      const totalEnergy = logs.reduce((sum, log) => sum + log.energyLevel, 0);
      const avgEnergy = totalEnergy / logs.length;

      const gymDays = logs.filter((log) => log.gymAttendance).length;
      const gymConsistency = (gymDays / logs.length) * 100;

      return {
        weightGainSpeed: weightGainSpeed.toFixed(2),
        avgStrength: avgStrength.toFixed(1),
        avgEnergy: avgEnergy.toFixed(1),
        gymConsistency: gymConsistency.toFixed(1),
        daysCount,
      };
    };

    const preStats = calculateStats(preCreatine);
    const postStats = calculateStats(postCreatine);

    // Get PR count from workout logs
    const preWorkouts = await WorkoutLog.find({
      userId: req.user.userId,
      date: { $lt: creatineStartDate },
    });

    const postWorkouts = await WorkoutLog.find({
      userId: req.user.userId,
      date: { $gte: creatineStartDate },
    });

    let prePRCount = 0;
    preWorkouts.forEach((workout) => {
      prePRCount += workout.exercises.filter((ex) => ex.personalRecord).length;
    });

    let postPRCount = 0;
    postWorkouts.forEach((workout) => {
      postPRCount += workout.exercises.filter((ex) => ex.personalRecord).length;
    });

    res.json({
      preCreatine: {
        ...preStats,
        prCount: prePRCount,
      },
      postCreatine: {
        ...postStats,
        prCount: postPRCount,
      },
      improvement: {
        weightGainSpeed: preStats.weightGainSpeed > 0 
          ? ((postStats.weightGainSpeed - preStats.weightGainSpeed) / preStats.weightGainSpeed * 100).toFixed(1) + '%'
          : 'N/A',
        strength: preStats.avgStrength > 0 
          ? ((postStats.avgStrength - preStats.avgStrength) / preStats.avgStrength * 100).toFixed(1) + '%'
          : 'N/A',
        energy: preStats.avgEnergy > 0 
          ? ((postStats.avgEnergy - preStats.avgEnergy) / preStats.avgEnergy * 100).toFixed(1) + '%'
          : 'N/A',
      },
    });
  } catch (err) {
    console.error('Error in getCreatineComparison:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
