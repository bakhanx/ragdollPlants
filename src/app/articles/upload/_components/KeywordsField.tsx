import React from 'react';

interface KeywordsFieldProps {
  keywords: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keywordsArray: string[];
}

export default function KeywordsField({ 
  keywords, 
  onChange, 
  keywordsArray 
}: KeywordsFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="keywords"
        className="block text-sm font-medium text-gray-50">
        키워드{' '}
        <span className="text-xs text-gray-400">
          (선택사항, 쉼표로 구분)
        </span>
      </label>
      <input
        id="keywords"
        type="text"
        value={keywords}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
        placeholder="예: 식물관리, 분갈이, 햇빛"
      />
      {keywordsArray.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {keywordsArray.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
} 