"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";

interface ToastData {
  name: string;
  description: string;
  rarity: string;
}

const rarityEmoji: Record<string, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🏆",
  platinum: "👑",
  diamond: "💎",
};

let showToastFn: ((data: ToastData) => void) | null = null;

export function showAchievementToast(data: ToastData) {
  showToastFn?.(data);
}

export function AchievementToastProvider() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback((data: ToastData) => {
    setToast(data);
    setVisible(true);
    if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
    setTimeout(() => setVisible(false), 4000);
    setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    showToastFn = show;
    return () => { showToastFn = null; };
  }, [show]);

  if (!toast) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) ${visible ? "translateY(0)" : "translateY(-20px)"}`,
        pointerEvents: "none",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg"
        style={{
          background: "var(--mf-surface)",
          border: "1px solid var(--mf-border-subtle)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ background: "rgba(45,106,79,0.1)" }}
        >
          {rarityEmoji[toast.rarity] ?? <Trophy className="w-5 h-5" style={{ color: "var(--forest)" }} />}
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: "var(--forest)" }}>Conquista desbloqueada!</p>
          <p className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>{toast.name}</p>
          <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>{toast.description}</p>
        </div>
      </div>
    </div>
  );
}
