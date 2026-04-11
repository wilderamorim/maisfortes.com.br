import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/Skeleton";

export default function HistoryLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-4">
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-10 w-full rounded-xl" />

      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <SkeletonText width="30%" />
              <SkeletonText width="50%" />
            </div>
            <Skeleton className="h-6 w-8 rounded-lg" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}
