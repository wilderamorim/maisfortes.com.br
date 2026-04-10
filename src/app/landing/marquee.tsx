"use client";

export function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const content = items.join(" — ");
  return (
    <div className="overflow-hidden whitespace-nowrap select-none" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
      <div
        className="inline-block"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        <span className="inline-block pr-8 text-sm font-mono uppercase tracking-[0.2em]" style={{ color: "var(--mf-text-muted)", opacity: 0.4 }}>
          {content} — {content} —&nbsp;
        </span>
      </div>
    </div>
  );
}
