import { Skeleton } from "@/components/ui/Skeleton";

export default function GoalsLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-7 w-28" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
