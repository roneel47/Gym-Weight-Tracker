/**
 * Workout Log Model
 * Tracks individual exercises, sets, reps, weight, and personal records
 */

const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      // Store date at UTC midnight to avoid timezone drift
      set: (v) => {
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return v;
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      },
    },
    exercises: [
      {
        exerciseName: {
          type: String,
          required: [true, 'Exercise name is required'],
          trim: true,
          maxlength: [100, 'Exercise name cannot exceed 100 characters'],
        },
        muscleGroup: {
          type: String,
          required: [true, 'Muscle group is required'],
          enum: {
            values: ['Back', 'Biceps', 'Legs', 'Shoulders', 'Chest', 'Triceps', 'Forearms', 'Calves', 'Abs', 'Other'],
            message: 'Invalid muscle group',
          },
        },
        // Individual sets with their own reps and weight
        setsData: [
          {
            reps: {
              type: Number,
              required: [true, 'Reps are required'],
              min: [1, 'Reps must be at least 1'],
              max: [100, 'Reps cannot exceed 100'],
              validate: {
                validator: Number.isInteger,
                message: 'Reps must be a whole number',
              },
            },
            weight: {
              type: Number,
              required: [true, 'Weight is required'],
              min: [0, 'Weight cannot be negative'],
              max: [500, 'Weight cannot exceed 500 kg'],
              validate: {
                validator: function (v) {
                  return /^\d+(\.\d{1,2})?$/.test(v.toString());
                },
                message: 'Weight must have at most 2 decimal places',
              },
            },
          },
        ],
        // Legacy fields for backward compatibility
        sets: {
          type: Number,
          min: [1, 'Sets must be at least 1'],
          max: [10, 'Sets cannot exceed 10'],
        },
        reps: {
          type: Number,
          min: [1, 'Reps must be at least 1'],
          max: [100, 'Reps cannot exceed 100'],
        },
        weightUsed: {
          type: Number,
          min: [0, 'Weight cannot be negative'],
          max: [500, 'Weight cannot exceed 500 kg'],
        },
        personalRecord: {
          type: Boolean,
          default: false,
        },
        notes: {
          type: String,
          maxlength: [300, 'Notes cannot exceed 300 characters'],
          trim: true,
        },
      },
    ],
    totalVolume: {
      type: Number,
      default: 0,
      // Calculated as sum of (sets × reps × weight) for all exercises
    },
  },
  { timestamps: true }
);

// Indexes for performance
workoutLogSchema.index({ userId: 1, date: 1 });
workoutLogSchema.index({ userId: 1, date: -1 });

// Virtual field: volume calculation for entire workout
workoutLogSchema.virtual('volume').get(function () {
  if (!this.exercises || this.exercises.length === 0) {
    return 0;
  }
  return this.exercises.reduce((total, exercise) => {
    // Use setsData if available, otherwise fall back to legacy fields
    if (exercise.setsData && exercise.setsData.length > 0) {
      return total + exercise.setsData.reduce((setTotal, set) => {
        return setTotal + set.reps * set.weight;
      }, 0);
    }
    return total + (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weightUsed || 0);
  }, 0);
});

// Pre-save hook to calculate total volume
workoutLogSchema.pre('save', function () {
  if (this.exercises && this.exercises.length > 0) {
    this.totalVolume = this.exercises.reduce((total, exercise) => {
      // Use setsData if available, otherwise fall back to legacy fields
      if (exercise.setsData && exercise.setsData.length > 0) {
        return total + exercise.setsData.reduce((setTotal, set) => {
          return setTotal + set.reps * set.weight;
        }, 0);
      }
      return total + (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weightUsed || 0);
    }, 0);
  } else {
    this.totalVolume = 0;
  }
});

// Instance method to get PRs for date range
workoutLogSchema.statics.getPRsByDateRange = async function (userId, startDate, endDate) {
  const logs = await this.find({
    userId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  const prs = [];
  logs.forEach((log) => {
    log.exercises.forEach((exercise) => {
      if (exercise.personalRecord) {
        prs.push({
          date: log.date,
          exercise: exercise.exerciseName,
          muscleGroup: exercise.muscleGroup,
          weight: exercise.weightUsed,
          sets: exercise.sets,
          reps: exercise.reps,
        });
      }
    });
  });

  return prs;
};

// Instance method to get volume by muscle group
workoutLogSchema.statics.getVolumeByMuscleGroup = async function (userId, startDate, endDate) {
  const logs = await this.find({
    userId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  const volumeByMuscle = {};
  logs.forEach((log) => {
    log.exercises.forEach((exercise) => {
      if (!volumeByMuscle[exercise.muscleGroup]) {
        volumeByMuscle[exercise.muscleGroup] = 0;
      }
      // Use setsData if available, otherwise fall back to legacy fields
      if (exercise.setsData && exercise.setsData.length > 0) {
        volumeByMuscle[exercise.muscleGroup] += exercise.setsData.reduce((setTotal, set) => {
          return setTotal + set.reps * set.weight;
        }, 0);
      } else {
        volumeByMuscle[exercise.muscleGroup] += (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weightUsed || 0);
      }
    });
  });

  return volumeByMuscle;
};

// Indexes for performance optimization
workoutLogSchema.index({ userId: 1, date: -1 }); // Compound index for user's workouts sorted by date
workoutLogSchema.index({ userId: 1 }); // Single index for user-based queries
workoutLogSchema.index({ date: 1 }); // Index for date-based queries

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
