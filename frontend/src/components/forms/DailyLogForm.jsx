import React from 'react';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import { Button } from '../common/Button';

const DailyLogForm = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Date" type="date" required />
        <Input label="Weight (kg)" type="number" step="0.1" min="0" max="200" required />
        <Input label="Eggs consumed" type="number" min="0" max="50" />
        <Input label="Energy level (1-5)" type="number" min="1" max="5" />
        <Input label="Strength level (1-5)" type="number" min="1" max="5" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Checkbox label="Went to gym" />
        <Checkbox label="Took creatine" />
      </div>
      <Input label="Notes" as="textarea" rows={3} />
      <Button type="submit" variant="primary">
        Save daily log (placeholder)
      </Button>
    </form>
  );
};

export default DailyLogForm;
