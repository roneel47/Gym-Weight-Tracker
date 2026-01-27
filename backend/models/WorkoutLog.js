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
      // Only store date part, not time
      set: (v) => new Date(v.getFullYear(), v.getMonth(), v.getDate()),
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
        sets: {
          type: Number,
          required: [true, 'Sets are required'],
          min: [1, 'Sets must be at least 1'],
          max: [10, 'Sets cannot exceed 10'],
          validate: {
            validator: Number.isInteger,
            message: 'Sets must be a whole number',
          },
        },
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
        weightUsed: {
          type: Number,
          required: [true, 'Weight used is required'],
          min: [0, 'Weight cannot be negative'],
          max: [500, 'Weight cannot exceed 500 kg'],
          validate: {
            validator: function (v) {
              return /^\d+(\.\d{1,2})?$/.test(v.toString());
            },
            message: 'Weight must have at most 2 decimal places',
          },
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
    return total + exercise.sets * exercise.reps * exercise.weightUsed;
  }, 0);
});

// Pre-save hook to calculate total volume
workoutLogSchema.pre('save', function (next) {
  if (this.exercises && this.exercises.length > 0) {
    this.totalVolume = this.exercises.reduce((total, exercise) => {
      return total + exercise.sets * exercise.reps * exercise.weightUsed;
    }, 0);
  } else {
    this.totalVolume = 0;
  }
  next();
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
      volumeByMuscle[exercise.muscleGroup] += exercise.sets * exercise.reps * exercise.weightUsed;
    });
  });

  return volumeByMuscle;
};

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
