import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'error';
}

export const Badge = ({ className = '', variant = 'neutral', children, ...props }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[13px] font-medium transition-colors';
  
  const variants = {
    neutral: 'bg-gray-100 text-text-secondary',
    success: 'bg-green-50 text-success border border-green-200',
    warning: 'bg-amber-50 text-warning border border-amber-200',
    error: 'bg-red-50 text-error border border-red-200',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
