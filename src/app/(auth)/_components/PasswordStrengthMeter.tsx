import React from 'react';
import {
  calculatePasswordStrength,
  type PasswordStrength
} from '@/lib/utils/passwordStrength';

type PasswordStrengthMeterProps = {
  password: string;
  showSuggestions?: boolean;
};

export const PasswordStrengthMeter = ({
  password,
  showSuggestions = true
}: PasswordStrengthMeterProps) => {
  const strength = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 flex justify-between space-y-2">
      {/* 개선 제안 */}
      {showSuggestions && strength.suggestions.length > 0 && (
        <div className="space-y-1">
          {strength.suggestions.slice(0, 2).map((suggestion, index) => (
            <p
              key={index}
              className="flex items-center gap-1 text-xs text-gray-200">
              <span className="text-blue-500">💡</span>
              {suggestion}
            </p>
          ))}
        </div>
      )}

      {/* 강도 게이지 */}
      <div className="flex w-1/2 items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div className="flex h-full">
            {[1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`flex-1 transition-all duration-300 ${
                  level <= strength.score ? strength.bgColor : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        <span className={`text-sm font-medium ${strength.color}`}>
          {strength.level}
        </span>
      </div>
    </div>
  );
};
