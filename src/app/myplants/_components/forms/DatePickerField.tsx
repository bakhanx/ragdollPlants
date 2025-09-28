'use client';

import React, { useRef } from 'react';
import { ScheduleIcon } from '@/app/_components/icons/Icons';

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  max: string;
  label?: string;
}

const DatePickerField = ({
  value,
  onChange,
  max,
  label
}: DatePickerFieldProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateFieldClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const formattedDate = value
    ? new Date(value).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <div
      className="relative cursor-pointer rounded-md border border-gray-300"
      onClick={handleDateFieldClick}>
      <div className="flex items-center">
        <div className="flex-grow px-3 py-2">
          {formattedDate ? (
            <span className="text-sm text-gray-50">{formattedDate}</span>
          ) : (
            <span className="text-sm text-gray-200">
              {label || '날짜를 선택해주세요'}
            </span>
          )}
        </div>
        <div className="pr-3">
          <ScheduleIcon
            size={20}
            className="text-gray-50"
          />
        </div>
      </div>

      <input
        ref={dateInputRef}
        type="date"
        id="acquired-date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        max={max}
        required
      />
    </div>
  );
};

export default React.memo(DatePickerField);
