import React, { forwardRef } from "react";

type InputProps = {
  placeholder: string;
  type?: "text" | "email" | "phone" | "range" | (string & {});
  error?: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, type = "text", error, name, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          name={name}
          className={`w-full p-3 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 text-gray-500 transition-colors ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-green-600'
          } ${className}`}
          placeholder={placeholder}
          type={type}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
