import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import { Button } from '../common/Button';
import * as dailyLogService from '../../services/dailyLogService';

const DailyLogForm = ({ onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    eggsConsumed: '',
    gymAttendance: false,
    creatineIntake: false,
    energyLevel: '',
    strengthInGym: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form if editing existing log
  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : formData.date,
        weight: initialData.weight || '',
        eggsConsumed: initialData.eggsConsumed || '',
        gymAttendance: initialData.gymAttendance || false,
        creatineIntake: initialData.creatineIntake || false,
        energyLevel: initialData.energyLevel || '',
        strengthInGym: initialData.strengthInGym || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

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

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (formData.weight < 0 || formData.weight > 200) {
      newErrors.weight = 'Weight must be between 0 and 200 kg';
    }

    if (formData.eggsConsumed && (formData.eggsConsumed < 0 || formData.eggsConsumed > 50)) {
      newErrors.eggsConsumed = 'Eggs must be between 0 and 50';
    }

    if (formData.energyLevel && (formData.energyLevel < 1 || formData.energyLevel > 5)) {
      newErrors.energyLevel = 'Energy level must be between 1 and 5';
    }

    if (formData.strengthInGym && (formData.strengthInGym < 1 || formData.strengthInGym > 5)) {
      newErrors.strengthInGym = 'Strength level must be between 1 and 5';
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

      // Convert empty strings to undefined for optional fields
      const payload = {
        date: formData.date,
        weight: Number(formData.weight),
        eggsConsumed: formData.eggsConsumed ? Number(formData.eggsConsumed) : 0,
        gymAttendance: formData.gymAttendance,
        creatineIntake: formData.creatineIntake,
        energyLevel: formData.energyLevel ? Number(formData.energyLevel) : undefined,
        strengthInGym: formData.strengthInGym ? Number(formData.strengthInGym) : undefined,
        notes: formData.notes || undefined,
      };

      if (initialData?._id) {
        await dailyLogService.updateDailyLog(initialData._id, payload);
        toast.success('Daily log updated successfully!');
      } else {
        await dailyLogService.createDailyLog(payload);
        toast.success('Daily log created successfully!');
      }

      if (onSuccess) {
        onSuccess();
      }

      // Reset form if creating new entry
      if (!initialData) {
        handleClear();
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save daily log. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      eggsConsumed: '',
      gymAttendance: false,
      creatineIntake: false,
      energyLevel: '',
      strengthInGym: '',
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
          label="Weight (kg)"
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          error={errors.weight}
          step="0.1"
          min="0"
          max="200"
          placeholder="75.5"
          required
        />
        <Input
          label="Eggs consumed"
          type="number"
          name="eggsConsumed"
          value={formData.eggsConsumed}
          onChange={handleChange}
          error={errors.eggsConsumed}
          min="0"
          max="50"
          placeholder="0"
        />
        <Input
          label="Energy level (1-5)"
          type="number"
          name="energyLevel"
          value={formData.energyLevel}
          onChange={handleChange}
          error={errors.energyLevel}
          min="1"
          max="5"
          placeholder="3"
        />
        <Input
          label="Strength in gym (1-5)"
          type="number"
          name="strengthInGym"
          value={formData.strengthInGym}
          onChange={handleChange}
          error={errors.strengthInGym}
          min="1"
          max="5"
          placeholder="3"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Checkbox
          label="Went to gym today"
          name="gymAttendance"
          checked={formData.gymAttendance}
          onChange={handleChange}
        />
        <Checkbox
          label="Took creatine today"
          name="creatineIntake"
          checked={formData.creatineIntake}
          onChange={handleChange}
        />
      </div>
      <Input
        label="Notes (optional)"
        as="textarea"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={3}
        placeholder="Any observations about today..."
      />
      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={loading} disabled={loading}>
          {initialData ? 'Update Log' : 'Save Log'}
        </Button>
        {!initialData && (
          <Button type="button" variant="secondary" onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        )}
      </div>
    </form>
  );
};

export default DailyLogForm;
