import React from 'react';

export interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'textarea';
  rows?: number;
}

export const FormField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  type = 'text',
  rows = 3 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-50">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'text' ? (
        <input
          id={id}
          type="text"
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={rows}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}; 