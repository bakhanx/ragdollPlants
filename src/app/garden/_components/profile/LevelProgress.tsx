type LevelProgressProps = {
  progress: number;
};

export default function LevelProgress({ progress }: LevelProgressProps) {
  return (
    <div className="relative mt-5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-gray-600 sm:text-sm">
          다음 레벨까지
        </span>
        <span className="text-xs font-medium text-green-700 sm:text-sm">
          {progress}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 