import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function CheckinLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-7 w-24" />
      </div>

      <SkeletonCard className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-14 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </SkeletonCard>
    </div>
  );
}
