export function CareCardListSkeleton() {
  return (
    <div className="space-y-4 py-10">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-lg bg-white/10"
        />
      ))}
    </div>
  );
}
