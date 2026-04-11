import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="text-center">
            <Skeleton className="h-6 w-10 mx-auto mb-1" />
            <SkeletonText width="60%" />
          </SkeletonCard>
        ))}
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
