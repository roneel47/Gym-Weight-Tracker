/**
 * Daily Log Model
 * Tracks daily metrics: weight, eggs, gym attendance, creatine, energy, strength
 */

const mongoose = require('mongoose');
const { calculateDailyChange, calculateSevenDayAverage, getWeightStatus } = require('../utils/calculations');

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      // Only store date part, not time
      set: (v) => new Date(v.getFullYear(), v.getMonth(), v.getDate()),
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative'],
      max: [200, 'Weight cannot exceed 200 kg'],
      validate: {
        validator: function (v) {
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: 'Weight must have at most 2 decimal places',
      },
    },
    eggsConsumed: {
      type: Number,
      required: [true, 'Eggs consumed is required'],
      min: [0, 'Eggs cannot be negative'],
      max: [50, 'Eggs cannot exceed 50'],
      validate: {
        validator: Number.isInteger,
        message: 'Eggs must be a whole number',
      },
    },
    gymAttendance: {
      type: Boolean,
      default: false,
    },
    creatineIntake: {
      type: Boolean,
      default: false,
    },
    energyLevel: {
      type: Number,
      min: [1, 'Energy level must be between 1-5'],
      max: [5, 'Energy level must be between 1-5'],
      validate: {
        validator: Number.isInteger,
        message: 'Energy level must be a whole number',
      },
    },
    strengthInGym: {
      type: Number,
      min: [1, 'Strength level must be between 1-5'],
      max: [5, 'Strength level must be between 1-5'],
      validate: {
        validator: Number.isInteger,
        message: 'Strength level must be a whole number',
      },
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
    dailyChange: {
      type: Number,
      default: null,
    },
    sevenDayAverage: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      default: 'No data',
    },
  },
  { timestamps: true }
);

// Compound index on userId and date (unique per user)
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for queries sorted by date
dailyLogSchema.index({ userId: 1, date: -1 });

// Pre-save validation: ensure unique date per user
dailyLogSchema.pre('save', async function () {
  if (this.isNew) {
    const existing = await mongoose.model('DailyLog').findOne({
      userId: this.userId,
      date: this.date,
    });

    if (existing) {
      throw new Error('Entry already exists for this date');
    }
  }
});

// Instance method to populate calculated fields
dailyLogSchema.methods.populateCalculatedFields = async function () {
  // Get previous day's weight for daily change
  const previousDay = await mongoose.model('DailyLog').findOne({
    userId: this.userId,
    date: {
      $lt: this.date,
    },
  }).sort({ date: -1 });

  this.dailyChange = calculateDailyChange(this.weight, previousDay?.weight);

  // Get last 7 days including today for average
  const sevenDaysAgo = new Date(this.date);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const lastSevenDays = await mongoose.model('DailyLog').find({
    userId: this.userId,
    date: {
      $gte: sevenDaysAgo,
      $lte: this.date,
    },
  }).sort({ date: 1 });

  const weights = lastSevenDays.map((log) => log.weight);
  this.sevenDayAverage = calculateSevenDayAverage(weights);

  // Get weekly gain for status
  const oneWeekAgo = new Date(this.date);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weekAgo = await mongoose.model('DailyLog').findOne({
    userId: this.userId,
    date: {
      $lte: oneWeekAgo,
    },
  }).sort({ date: -1 });

  let weeklyGain = null;
  if (weekAgo) {
    // Use actual weight difference compared to entry at/near 7 days ago
    weeklyGain = this.weight - weekAgo.weight;
  }

  this.status = getWeightStatus(weeklyGain);

  return this;
};

module.exports = mongoose.model('DailyLog', dailyLogSchema);
