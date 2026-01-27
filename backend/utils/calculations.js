/**
 * Calculation Utilities
 * Helper functions for weight tracking calculations
 */

/**
 * Calculate daily weight change
 * @param {number} currentWeight - Today's weight
 * @param {number} previousWeight - Yesterday's weight
 * @returns {number} Daily change in kg
 */
const calculateDailyChange = (currentWeight, previousWeight) => {
  if (!previousWeight) return null;
  return parseFloat((currentWeight - previousWeight).toFixed(2));
};

/**
 * Calculate 7-day average weight
 * @param {array} weights - Array of weight values
 * @returns {number} Average weight rounded to 2 decimals
 */
const calculateSevenDayAverage = (weights) => {
  if (!weights || weights.length === 0) return null;
  const sum = weights.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / weights.length).toFixed(2));
};

/**
 * Determine weight status based on weekly gain
 * @param {number} weeklyGain - Weight gained in kg per week
 * @returns {string} Status: 'Going Up', 'Too Slow', 'Dropping', 'Too Fast'
 */
const getWeightStatus = (weeklyGain) => {
  if (weeklyGain === null || weeklyGain === undefined) return 'No Data';
  if (weeklyGain >= 0.2 && weeklyGain <= 0.5) return 'Going Up';
  if (weeklyGain > 0 && weeklyGain < 0.2) return 'Too Slow';
  if (weeklyGain <= 0) return 'Dropping';
  if (weeklyGain > 0.5) return 'Too Fast';
};

/**
 * Calculate gym consistency percentage
 * @param {number} gymDays - Days attended gym
 * @param {number} totalDays - Total days in period
 * @returns {number} Percentage (0-100)
 */
const calculateGymConsistency = (gymDays, totalDays) => {
  if (totalDays === 0) return 0;
  return Math.round((gymDays / totalDays) * 100);
};

/**
 * Calculate creatine usage percentage
 * @param {number} creatineDays - Days creatine was taken
 * @param {number} totalDays - Total days in period
 * @returns {number} Percentage (0-100)
 */
const calculateCreatineUsage = (creatineDays, totalDays) => {
  if (totalDays === 0) return 0;
  return Math.round((creatineDays / totalDays) * 100);
};

module.exports = {
  calculateDailyChange,
  calculateSevenDayAverage,
  getWeightStatus,
  calculateGymConsistency,
  calculateCreatineUsage,
};
