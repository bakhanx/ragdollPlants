'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    required,
    error,
    helpText,
    className = "",
    id,
    ...props 
  }, ref) => {
    
    const inputStyles = `bg-opacity-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none bg-black/10 placeholder-gray-300 ${
      error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    } ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-50">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={id}
          className={inputStyles}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        
        {helpText && !error && (
          <p className="mt-1 text-xs text-gray-300">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; 