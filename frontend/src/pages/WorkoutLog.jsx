import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Layout from '../components/common/Layout';
import WorkoutLogForm from '../components/forms/WorkoutLogForm';
import EditExerciseModal from '../components/forms/EditExerciseModal';
import { Button } from '../components/common/Button';
import Loading from '../components/common/Loading';
import * as workoutLogService from '../services/workoutLogService';
import { formatDate } from '../utils/helpers';
import { MUSCLE_GROUPS } from '../utils/constants';
import { exportToCSV, formatWorkoutLogsForExport } from '../utils/exportUtils';

const WorkoutLog = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMuscleGroup, setFilterMuscleGroup] = useState('');
  const [editingExercise, setEditingExercise] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workoutLogService.getWorkoutLogsByDate(selectedDate);
      // Normalize different response shapes to a consistent array
      const normalized = Array.isArray(data?.workoutLogs)
        ? data.workoutLogs
        : Array.isArray(data?.logs)
        ? data.logs
        : Array.isArray(data)
        ? data
        : [];
      setWorkouts(normalized);
    } catch (err) {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDeleteExercise = async (workoutId, exerciseIndex) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;

    try {
      await workoutLogService.removeExercise(workoutId, exerciseIndex);
      toast.success('Exercise deleted');
      fetchWorkouts();
    } catch (err) {
      toast.error('Failed to delete exercise');
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
  };

  const handleSaveEdit = async (updatedExercise) => {
    try {
      const workout = workouts.find(w => w._id === editingExercise.workoutId);
      if (!workout) {
        toast.error('Workout not found');
        return;
      }

      // Replace the edited exercise in the exercises array
      const updatedExercises = [...workout.exercises];
      updatedExercises[editingExercise.exerciseIndex] = updatedExercise;

      await workoutLogService.updateWorkoutLog(editingExercise.workoutId, {
        exercises: updatedExercises,
      });

      toast.success('Exercise updated successfully');
      setEditingExercise(null);
      fetchWorkouts();
    } catch (err) {
      toast.error('Failed to update exercise');
    }
  };

  // Calculate total volume for the day
  const calculateTotalVolume = () => {
    let total = 0;
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        // Use setsData if available, otherwise fall back to legacy fields
        if (exercise.setsData && exercise.setsData.length > 0) {
          exercise.setsData.forEach((set) => {
            total += set.reps * set.weight;
          });
        } else {
          total += (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weightUsed || 0);
        }
      });
    });
    return total.toFixed(2);
  };

  // Count PRs for the day
  const countPRs = () => {
    let count = 0;
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.personalRecord) count++;
      });
    });
    return count;
  };

  // Get all exercises from all workouts
  const getAllExercises = () => {
    const exercises = [];
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise, index) => {
        exercises.push({
          ...exercise,
          workoutId: workout._id,
          exerciseIndex: index,
        });
      });
    });
    return exercises;
  };

  // Filter exercises by muscle group
  const filteredExercises = () => {
    const allExercises = getAllExercises();
    if (!filterMuscleGroup) return allExercises;
    return allExercises.filter((ex) => ex.muscleGroup === filterMuscleGroup);
  };

  const handleExport = async () => {
    try {
      const response = await workoutLogService.getWorkoutLogs(10000, 1);
      const workoutData = Array.isArray(response?.logs) 
        ? response.logs 
        : Array.isArray(response?.workoutLogs)
        ? response.workoutLogs
        : Array.isArray(response)
        ? response
        : [];
      const formattedData = formatWorkoutLogsForExport(workoutData);
      const filename = `workout-logs-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(formattedData, filename);
      toast.success('Workout logs exported successfully!');
    } catch (err) {
      toast.error('Failed to export workout logs');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const exercises = filteredExercises();
  const totalVolume = calculateTotalVolume();
  const prCount = countPRs();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Workout Log</h1>
            <p className="text-neutral-600 text-sm mt-1">Track your exercises, sets, reps, and personal records</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <span className="material-icons text-sm mr-1">download</span>
            Export CSV
          </Button>
        </div>

        {/* Date Selector */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Select Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input max-w-xs"
          />
        </div>

        {/* Workout Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Log Exercise</h2>
          <WorkoutLogForm onSuccess={fetchWorkouts} selectedDate={selectedDate} />
        </div>

        {/* Workout Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card text-center">
            <p className="text-sm text-neutral-600 mb-1">Total Volume</p>
            <p className="text-2xl font-bold text-primary-600">{totalVolume} kg</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-neutral-600 mb-1">Personal Records</p>
            <p className="text-2xl font-bold text-success-600">{prCount} 🏆</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-neutral-600 mb-1">Exercises</p>
            <p className="text-2xl font-bold text-neutral-900">{exercises.length}</p>
          </div>
        </div>

        {/* Filter and Table */}
        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Workout for {formatDate(selectedDate)}
            </h2>
            <div>
              <select
                value={filterMuscleGroup}
                onChange={(e) => setFilterMuscleGroup(e.target.value)}
                className="input max-w-xs"
              >
                <option value="">All Muscle Groups</option>
                {MUSCLE_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {exercises.length === 0 ? (
            <p className="text-neutral-600 text-center py-8">No exercises logged for this date</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Exercise
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Muscle Group
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Sets
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Reps
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Weight (kg)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      PR
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {exercises.map((exercise, idx) => {
                    // Calculate volume based on setsData or legacy fields
                    let volume = 0;
                    let setsDisplay = '';
                    let repsDisplay = '';
                    let weightDisplay = '';
                    
                    if (exercise.setsData && exercise.setsData.length > 0) {
                      // New format with individual set tracking
                      setsDisplay = exercise.setsData.length;
                      repsDisplay = exercise.setsData.map(s => s.reps).join(', ');
                      weightDisplay = exercise.setsData.map(s => s.weight).join(', ');
                      volume = exercise.setsData.reduce((sum, set) => sum + (set.reps * set.weight), 0);
                    } else {
                      // Legacy format
                      setsDisplay = exercise.sets || 0;
                      repsDisplay = exercise.reps || 0;
                      weightDisplay = exercise.weightUsed || 0;
                      volume = (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weightUsed || 0);
                    }
                    
                    return (
                      <tr key={idx} className={exercise.personalRecord ? 'bg-success-50' : ''}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                          {exercise.exerciseName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {exercise.muscleGroup}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {setsDisplay}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {repsDisplay}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {weightDisplay}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-600">
                          {volume.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {exercise.personalRecord && <span className="text-success-600">🏆</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditExercise(exercise)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteExercise(exercise.workoutId, exercise.exerciseIndex)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingExercise && (
        <EditExerciseModal
          exercise={editingExercise}
          workoutId={editingExercise.workoutId}
          onSave={handleSaveEdit}
          onCancel={() => setEditingExercise(null)}
        />
      )}
    </Layout>
  );
};

export default WorkoutLog;
