const Settings = require('../models/Settings');

/**
 * Get user settings or create default if doesn't exist
 * GET /api/settings
 */
exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let settings = await Settings.findOne({ userId });

    // Create default settings if doesn't exist
    if (!settings) {
      settings = new Settings({ userId });
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message,
    });
  }
};

/**
 * Update user settings
 * PUT /api/settings
 */
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { creatineStartDate, targetWeight, weightUnit, theme, weekStartsOn, notifications } = req.body;

    // Validate inputs
    if (targetWeight !== undefined && (targetWeight < 0 || targetWeight > 200)) {
      return res.status(400).json({
        success: false,
        message: 'Target weight must be between 0 and 200 kg',
      });
    }

    if (weightUnit && !['kg', 'lbs'].includes(weightUnit)) {
      return res.status(400).json({
        success: false,
        message: 'Weight unit must be kg or lbs',
      });
    }

    if (theme && !['light', 'dark'].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Theme must be light or dark',
      });
    }

    if (weekStartsOn && !['Monday', 'Sunday'].includes(weekStartsOn)) {
      return res.status(400).json({
        success: false,
        message: 'Week must start on Monday or Sunday',
      });
    }

    const updateData = {};
    
    if (creatineStartDate !== undefined) updateData.creatineStartDate = creatineStartDate;
    if (targetWeight !== undefined) updateData.targetWeight = targetWeight;
    if (weightUnit) updateData.weightUnit = weightUnit;
    if (theme) updateData.theme = theme;
    if (weekStartsOn) updateData.weekStartsOn = weekStartsOn;
    if (notifications !== undefined) updateData.notifications = notifications;

    const settings = await Settings.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    });
  }
};

/**
 * Reset settings to defaults
 * POST /api/settings/reset
 */
exports.resetSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    await Settings.findOneAndUpdate(
      { userId },
      {
        creatineStartDate: null,
        targetWeight: null,
        weightUnit: 'kg',
        theme: 'light',
        weekStartsOn: 'Monday',
        notifications: {
          enabled: true,
          dailyReminder: true,
          workoutReminder: true,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings reset to defaults',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
      error: error.message,
    });
  }
};
