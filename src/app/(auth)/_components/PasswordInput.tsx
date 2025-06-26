'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

type PasswordInputProps = {
  placeholder: string;
  error?: string;
  name: string;
  showStrengthMeter?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      placeholder,
      error,
      name,
      showStrengthMeter = false,

      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    //내부 state 동기화
    useEffect(() => {
      if (value !== undefined) {
        setPasswordValue(value as string);
      }
    }, [value]);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setPasswordValue(newValue);

      // 부모 컴포넌트의 onChange 호출 (react-hook-form register)
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            name={name}
            className={`w-full rounded-lg border bg-gray-100 p-3 pr-12 text-gray-500 transition-colors focus:ring-2 focus:outline-none ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-600'
            }`}
            placeholder={placeholder}
            type={showPassword ? 'text' : 'password'}
            value={value !== undefined ? value : passwordValue}
            onChange={handlePasswordChange}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm text-green-600 hover:text-gray-700 focus:outline-none">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {/* 비밀번호 강도 게이지 */}
        {showStrengthMeter && (
          <PasswordStrengthMeter
            password={value !== undefined ? (value as string) : passwordValue}
            showSuggestions={true}
          />
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
