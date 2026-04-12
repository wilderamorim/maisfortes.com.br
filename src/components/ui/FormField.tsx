import type { ReactNode } from "react";

export function FormField({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--mf-text-secondary)" }}>
          {label}
        </label>
      )}
      <div
        className="rounded-xl transition-all"
        style={error ? { outline: "2px solid var(--danger)", outlineOffset: -1, borderRadius: 12 } : undefined}
      >
        {children}
      </div>
      {error && (
        <p className="text-[11px] mt-1" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
