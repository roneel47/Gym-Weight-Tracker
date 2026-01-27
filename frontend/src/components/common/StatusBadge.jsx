import React from 'react';

const variants = {
  success: 'text-success-700 bg-success-50',
  warning: 'text-warning-700 bg-warning-50',
  danger: 'text-danger-700 bg-danger-50',
  neutral: 'text-neutral-700 bg-neutral-100',
  primary: 'text-primary-700 bg-primary-50',
};

const StatusBadge = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
