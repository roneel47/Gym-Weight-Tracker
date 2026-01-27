import React from 'react';
import Input from '../common/Input';
import { Button } from '../common/Button';

const WorkoutLogForm = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Date" type="date" required />
        <Input label="Exercise" placeholder="Bench Press" required />
        <Input label="Muscle group" placeholder="Chest" />
        <Input label="Sets" type="number" min="1" max="10" />
        <Input label="Reps" type="number" min="1" max="100" />
        <Input label="Weight used (kg)" type="number" min="0" max="500" step="0.5" />
      </div>
      <Button type="submit" variant="primary">
        Save workout (placeholder)
      </Button>
    </form>
  );
};

export default WorkoutLogForm;
