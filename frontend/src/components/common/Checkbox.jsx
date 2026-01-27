import React from 'react';

const Checkbox = ({ label, checked, onChange, helperText, className = '', ...props }) => {
  return (
    <label className={`flex items-start gap-2 text-sm text-neutral-800 ${className}`}>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <span>
        {label}
        {helperText && <p className="text-xs text-neutral-500">{helperText}</p>}
      </span>
    </label>
  );
};

export default Checkbox;
