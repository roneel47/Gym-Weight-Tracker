import React from 'react';

const Input = React.forwardRef(({ label, error, helperText, className = '', as, id, ...props }, ref) => {
  const Component = as || 'input';
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <Component
        id={inputId}
        ref={ref}
        className={`input transition-all duration-200 ${
          error 
            ? 'border-danger-600 focus:ring-danger-600 focus:border-danger-600' 
            : 'hover:border-neutral-400'
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {helperText && !error && <p id={`${inputId}-helper`} className="mt-1 text-xs text-neutral-500">{helperText}</p>}
      {error && <p id={`${inputId}-error`} className="mt-1 text-xs text-danger-600 animate-fade-in" role="alert">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
