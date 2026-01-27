import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import SetInput from './SetInput';
import { Button } from '../common/Button';
import { MUSCLE_GROUPS } from '../../utils/constants';

const EditExerciseModal = ({ exercise, workoutId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    exerciseName: '',
    muscleGroup: '',
    setsData: [{ reps: '', weight: '' }],
    personalRecord: false,
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (exercise) {
      // Populate form with existing exercise data
      setFormData({
        exerciseName: exercise.exerciseName || '',
        muscleGroup: exercise.muscleGroup || '',
        setsData: exercise.setsData && exercise.setsData.length > 0
          ? exercise.setsData.map(set => ({ reps: set.reps, weight: set.weight }))
          : [{ reps: exercise.reps || '', weight: exercise.weightUsed || '' }],
        personalRecord: exercise.personalRecord || false,
        notes: exercise.notes || '',
      });
    }
  }, [exercise]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSet = () => {
    setFormData((prev) => ({
      ...prev,
      setsData: [...prev.setsData, { reps: '', weight: '' }],
    }));
  };

  const handleRemoveSet = (index) => {
    setFormData((prev) => ({
      ...prev,
      setsData: prev.setsData.filter((_, i) => i !== index),
    }));
  };

  const handleSetsChange = (newSetsData) => {
    setFormData((prev) => ({
      ...prev,
      setsData: newSetsData,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.exerciseName || formData.exerciseName.trim().length === 0) {
      newErrors.exerciseName = 'Exercise name is required';
    }

    if (!formData.muscleGroup) {
      newErrors.muscleGroup = 'Muscle group is required';
    }

    if (!formData.setsData || formData.setsData.length === 0) {
      newErrors.setsData = 'At least one set is required';
    } else {
      formData.setsData.forEach((set, index) => {
        if (!set.reps || set.reps < 1 || set.reps > 100) {
          newErrors[`set${index}Reps`] = `Set ${index + 1} reps must be between 1 and 100`;
        }
        if (!set.weight || set.weight < 0 || set.weight > 500) {
          newErrors[`set${index}Weight`] = `Set ${index + 1} weight must be between 0 and 500 kg`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const updatedExercise = {
      exerciseName: formData.exerciseName.trim(),
      muscleGroup: formData.muscleGroup,
      setsData: formData.setsData.map(set => ({
        reps: Number(set.reps),
        weight: Number(set.weight),
      })),
      personalRecord: formData.personalRecord,
      notes: formData.notes || undefined,
    };

    onSave(updatedExercise);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4">
          <h2 className="text-xl font-bold text-neutral-900">Edit Exercise</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <SetInput
            sets={formData.setsData}
            onChange={handleSetsChange}
            onAdd={handleAddSet}
            onRemove={handleRemoveSet}
          />
          {errors.setsData && <p className="text-xs text-danger-600">{errors.setsData}</p>}

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

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExerciseModal;
