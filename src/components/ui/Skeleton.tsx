export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "var(--mf-border-subtle)", ...style }}
    />
  );
}

export function SkeletonText({ width = "100%" }: { width?: string }) {
  return <Skeleton className="h-3 rounded-md" style={{ width }} />;
}

export function SkeletonCard({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
    >
      {children}
    </div>
  );
}
