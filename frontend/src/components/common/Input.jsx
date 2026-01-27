import React from 'react';

const Input = React.forwardRef(({ label, error, helperText, className = '', as, ...props }, ref) => {
  const Component = as || 'input';
  
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <Component
        ref={ref}
        className={`input transition-all duration-200 ${
          error 
            ? 'border-danger-600 focus:ring-danger-600 focus:border-danger-600' 
            : 'hover:border-neutral-400'
        } ${className}`}
        {...props}
      />
      {helperText && !error && <p className="mt-1 text-xs text-neutral-500">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-danger-600 animate-fade-in">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
