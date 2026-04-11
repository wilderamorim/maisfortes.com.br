import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Goal cards */}
      {[1, 2].map((i) => (
        <SkeletonCard key={i}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <SkeletonText width="60%" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </SkeletonCard>
      ))}

      {/* Support messages */}
      <SkeletonCard>
        <div className="space-y-2">
          <SkeletonText width="40%" />
          <SkeletonText width="80%" />
        </div>
      </SkeletonCard>
    </div>
  );
}
