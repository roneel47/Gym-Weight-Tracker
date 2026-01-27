/**
 * Settings Model
 * Stores user preferences and configuration
 */

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    creatineStartDate: {
      type: Date,
      default: null,
      set: (v) => {
        if (!v) return null;
        // If it's a string, parse it
        if (typeof v === 'string') {
          const date = new Date(v);
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        // If it's already a Date object
        if (v instanceof Date) {
          return new Date(v.getFullYear(), v.getMonth(), v.getDate());
        }
        return null;
      },
    },
    targetWeight: {
      type: Number,
      min: [0, 'Target weight cannot be negative'],
      max: [200, 'Target weight cannot exceed 200 kg'],
      default: null,
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    weekStartsOn: {
      type: String,
      enum: ['Monday', 'Sunday'],
      default: 'Monday',
    },
    notifications: {
      enabled: {
        type: Boolean,
        default: true,
      },
      dailyReminder: {
        type: Boolean,
        default: true,
      },
      workoutReminder: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Index on userId for quick lookups
settingsSchema.index({ userId: 1 });

module.exports = mongoose.model('Settings', settingsSchema);
