"use client";

import { useState } from "react";
import { updateGoalStatus } from "@/lib/actions/goals";
import { MoreVertical, Pause, Play, CheckCircle } from "lucide-react";

export function GoalMenu({ goalId, status }: { goalId: string; status: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAction(newStatus: string) {
    setLoading(true);
    try {
      await updateGoalStatus(goalId, newStatus);
    } catch {
      // Silently fail
    }
    setOpen(false);
    setLoading(false);
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1 rounded-lg transition-all active:scale-90"
        style={{ color: "var(--mf-text-muted)" }}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-8 z-50 rounded-xl py-1 min-w-[160px] shadow-lg"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            {status === "active" && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAction("paused"); }}
                disabled={loading}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors"
                style={{ color: "var(--mf-text)" }}
              >
                <Pause className="w-4 h-4" style={{ color: "var(--amber)" }} />
                Pausar meta
              </button>
            )}
            {status === "paused" && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAction("active"); }}
                disabled={loading}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors"
                style={{ color: "var(--mf-text)" }}
              >
                <Play className="w-4 h-4" style={{ color: "var(--forest)" }} />
                Reativar meta
              </button>
            )}
            {(status === "active" || status === "paused") && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAction("completed"); }}
                disabled={loading}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors"
                style={{ color: "var(--mf-text)" }}
              >
                <CheckCircle className="w-4 h-4" style={{ color: "var(--forest)" }} />
                Concluir meta
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
