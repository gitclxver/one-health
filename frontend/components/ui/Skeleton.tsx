export function CardSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-100 rounded-[32px] overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/9] bg-slate-200" />
      <div className="p-6 md:p-8 space-y-4">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="h-6 w-full bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-2/3 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
