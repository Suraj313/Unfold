import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-[8px] border bg-surface px-3 py-2 text-[15px] text-text-main transition-colors file:border-0 file:bg-transparent file:text-[14px] file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error 
            ? 'border-error focus-visible:ring-error/20 focus-visible:border-error' 
            : 'border-border-main hover:border-gray-300 focus-visible:border-primary focus-visible:ring-primary/20'
        } ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
