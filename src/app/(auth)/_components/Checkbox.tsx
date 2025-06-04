import React, { forwardRef } from 'react';

type CheckboxProps = {
  label: string;
  error?: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, name, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            name={name}
            type="checkbox"
            className={`h-5 w-5 rounded border-gray-300 ${className}`}
            {...props}
          />
          <label className="cursor-pointer text-sm text-white">{label}</label>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
