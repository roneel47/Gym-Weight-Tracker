import React from 'react';
import { Button } from '../common/Button';

const SetInput = ({ sets, onChange, onAdd, onRemove }) => {
  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    onChange(updatedSets);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-neutral-700">
          Sets <span className="text-danger-600">*</span>
        </label>
        <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
          + Add Set
        </Button>
      </div>
      
      {/* Column headers */}
      <div className="flex gap-2 items-center">
        <div className="flex-shrink-0 w-12"></div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <label className="text-xs font-medium text-neutral-600">Reps</label>
          <label className="text-xs font-medium text-neutral-600">Weight (kg)</label>
        </div>
        {sets.length > 1 && <div className="w-16"></div>}
      </div>
      
      {sets.map((set, index) => (
        <div key={index} className="flex gap-2 items-center">
          <div className="flex-shrink-0 w-12">
            <span className="text-sm font-medium text-neutral-600">Set {index + 1}</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              type="number"
              value={set.reps}
              onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
              min="1"
              max="100"
              placeholder="12"
              className="input"
              required
            />
            <input
              type="number"
              value={set.weight}
              onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
              min="0"
              max="500"
              step="0.5"
              placeholder="50"
              className="input"
              required
            />
          </div>
          {sets.length > 1 && (
            <div className="w-16">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => onRemove(index)}
              >
                ×
              </Button>
            </div>
          )}
        </div>
      ))}
      
      {sets.length === 0 && (
        <p className="text-sm text-neutral-500">Click "Add Set" to log your first set</p>
      )}
    </div>
  );
};

export default SetInput;
