'use client';

import React, { forwardRef } from 'react';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      required,
      error,
      helpText,
      resize = 'vertical',
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaStyles = `bg-opacity-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white  focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none resize-none ${
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
    } ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-gray-50">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={textareaStyles}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {helpText && !error && (
          <p className="mt-1 text-xs text-gray-400">{helpText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
