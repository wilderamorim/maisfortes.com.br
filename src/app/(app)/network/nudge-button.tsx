"use client";

import { useState } from "react";
import { nudgeFriend } from "@/lib/actions/friend-streaks";

export function NudgeButton({ friendStreakId, friendName }: { friendStreakId: string; friendName: string }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleNudge(e: React.MouseEvent) {
    e.stopPropagation();
    if (sent || loading) return;
    setLoading(true);
    try {
      await nudgeFriend(friendStreakId);
      setSent(true);
      if (navigator.vibrate) navigator.vibrate(30);
    } catch {
      // Already nudged today or error
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return <span className="text-[10px]" style={{ color: "var(--forest)" }}>👋 Cutucado!</span>;
  }

  return (
    <button
      onClick={handleNudge}
      disabled={loading}
      className="text-[10px] px-1.5 py-0.5 rounded-md transition-all active:scale-95"
      style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}
    >
      {loading ? "..." : "👋"}
    </button>
  );
}
