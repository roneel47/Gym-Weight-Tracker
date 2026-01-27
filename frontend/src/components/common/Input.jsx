import React from 'react';

const Input = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <label className="label">
      <span className="block text-sm font-medium text-neutral-700 mb-1">{label}</span>
      <input
        className={`input ${error ? 'border-danger-400 focus:ring-danger-500' : ''} ${className}`}
        {...props}
      />
      {helperText && !error && <p className="mt-1 text-xs text-neutral-500">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
    </label>
  );
};

export default Input;
