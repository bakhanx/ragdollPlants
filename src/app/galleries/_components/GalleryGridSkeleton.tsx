export function GalleryGridSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md px-4 pb-20">
      {/* 대표 작품 스켈레톤 */}
      <div className="mb-6">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-white/10" />
      </div>

      {/* 섹션 타이틀 스켈레톤 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-white/10"></div>
        <div className="h-4 w-16 animate-pulse rounded bg-white/10"></div>
      </div>

      {/* 3x3 그리드 스켈레톤 */}
      <div className="grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}