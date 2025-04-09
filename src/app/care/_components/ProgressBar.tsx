'use client';

interface ProgressBarProps {
  percentage: number;
  color: string;
}

export default function ProgressBar({ percentage, color }: ProgressBarProps) {
  // 퍼센트 값이 0~100 사이로 제한되도록 함
  const safePercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${safePercentage}%` }}
      />
    </div>
  );
} 