import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/Skeleton";

export default function NetworkLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-8">
      <Skeleton className="h-7 w-36" />

      {/* Ofensiva de Amigos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
        {[1, 2].map((i) => (
          <SkeletonCard key={i}>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 flex-1" style={{ maxWidth: "120px" }} />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="ml-12 space-y-1">
              <SkeletonText width="60%" />
              <SkeletonText width="50%" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Apoiadores */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <SkeletonCard>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <SkeletonText width="40%" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <SkeletonText width="30%" />
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
