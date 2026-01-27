import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import { Button } from '../common/Button';
import * as workoutLogService from '../../services/workoutLogService';
import { MUSCLE_GROUPS } from '../../utils/constants';

const WorkoutLogForm = ({ onSuccess, selectedDate }) => {
  const [formData, setFormData] = useState({
    date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
    exerciseName: '',
    muscleGroup: '',
    sets: '',
    reps: '',
    weightUsed: '',
    personalRecord: false,
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.exerciseName || formData.exerciseName.trim().length === 0) {
      newErrors.exerciseName = 'Exercise name is required';
    }

    if (!formData.muscleGroup) {
      newErrors.muscleGroup = 'Muscle group is required';
    }

    if (!formData.sets) {
      newErrors.sets = 'Sets is required';
    } else if (formData.sets < 1 || formData.sets > 10) {
      newErrors.sets = 'Sets must be between 1 and 10';
    }

    if (!formData.reps) {
      newErrors.reps = 'Reps is required';
    } else if (formData.reps < 1 || formData.reps > 100) {
      newErrors.reps = 'Reps must be between 1 and 100';
    }

    if (!formData.weightUsed) {
      newErrors.weightUsed = 'Weight is required';
    } else if (formData.weightUsed < 0 || formData.weightUsed > 500) {
      newErrors.weightUsed = 'Weight must be between 0 and 500 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      const exercise = {
        exerciseName: formData.exerciseName.trim(),
        muscleGroup: formData.muscleGroup,
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weightUsed: Number(formData.weightUsed),
        personalRecord: formData.personalRecord,
        notes: formData.notes || undefined,
      };

      const payload = {
        date: formData.date,
        exercises: [exercise],
      };

      await workoutLogService.createWorkoutLog(payload);
      toast.success('Exercise logged successfully!');

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      handleClear();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to log exercise. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
      exerciseName: '',
      muscleGroup: '',
      sets: '',
      reps: '',
      weightUsed: '',
      personalRecord: false,
      notes: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          className="bg-neutral-100"
          required
        />
        <Input
          label="Exercise Name"
          type="text"
          name="exerciseName"
          value={formData.exerciseName}
          onChange={handleChange}
          error={errors.exerciseName}
          placeholder="Bench Press"
          required
        />
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Muscle Group <span className="text-danger-600">*</span>
          </label>
          <select
            name="muscleGroup"
            value={formData.muscleGroup}
            onChange={handleChange}
            className={`input ${errors.muscleGroup ? 'border-danger-400 focus:ring-danger-500' : ''}`}
            required
          >
            <option value="">Select muscle group</option>
            {MUSCLE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.muscleGroup && <p className="mt-1 text-xs text-danger-600">{errors.muscleGroup}</p>}
        </div>
        <Input
          label="Sets"
          type="number"
          name="sets"
          value={formData.sets}
          onChange={handleChange}
          error={errors.sets}
          min="1"
          max="10"
          placeholder="3"
          required
        />
        <Input
          label="Reps"
          type="number"
          name="reps"
          value={formData.reps}
          onChange={handleChange}
          error={errors.reps}
          min="1"
          max="100"
          placeholder="12"
          required
        />
        <Input
          label="Weight Used (kg)"
          type="number"
          name="weightUsed"
          value={formData.weightUsed}
          onChange={handleChange}
          error={errors.weightUsed}
          min="0"
          max="500"
          step="0.5"
          placeholder="50"
          required
        />
      </div>
      <Checkbox
        label="Personal Record 🏆"
        name="personalRecord"
        checked={formData.personalRecord}
        onChange={handleChange}
      />
      <Input
        label="Notes (optional)"
        as="textarea"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={2}
        placeholder="How did the exercise feel?"
      />
      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={loading} disabled={loading}>
          Log Exercise
        </Button>
        <Button type="button" variant="secondary" onClick={handleClear} disabled={loading}>
          Clear
        </Button>
      </div>
    </form>
  );
};

export default WorkoutLogForm;
