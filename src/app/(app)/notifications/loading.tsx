import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function NotificationsLoading() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-4">
      <Skeleton className="h-7 w-36" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
        >
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonText width="70%" />
            <SkeletonText width="90%" />
            <SkeletonText width="20%" />
          </div>
        </div>
      ))}
    </div>
  );
}
