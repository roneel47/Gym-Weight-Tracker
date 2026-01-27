import React from 'react';

const Input = ({ label, error, helperText, className = '', as, ...props }) => {
  const Component = as || 'input';
  
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>}
      <Component
        className={`input ${error ? 'border-danger-400 focus:ring-danger-500' : ''} ${className}`}
        {...props}
      />
      {helperText && !error && <p className="mt-1 text-xs text-neutral-500">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
    </div>
  );
};

export default Input;
