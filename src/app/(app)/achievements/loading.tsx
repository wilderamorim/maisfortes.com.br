import { Skeleton } from "@/components/ui/Skeleton";

export default function AchievementsLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-7 w-32" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
