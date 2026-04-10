"use client";

import { Flame, Home, CalendarDays, Plus, Users, UserCircle } from "lucide-react";

export function AppMockup() {
  return (
    <div className="relative" style={{ animation: "float 6s ease-in-out infinite" }}>
      {/* Glow behind */}
      <div
        className="absolute -inset-8 rounded-3xl opacity-30 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(45,106,79,0.3), transparent 70%)" }}
      />

      {/* Phone frame */}
      <div
        className="relative w-[280px] mx-auto rounded-[36px] p-3 shadow-lg"
        style={{
          background: "var(--mf-surface)",
          border: "1px solid var(--mf-border)",
          boxShadow: "var(--mf-shadow-lg), 0 0 40px rgba(45,106,79,0.1)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-2xl" style={{ background: "var(--mf-bg)" }} />

        {/* Screen */}
        <div className="rounded-[24px] overflow-hidden" style={{ background: "var(--mf-bg)" }}>
          {/* Status bar */}
          <div className="h-10 flex items-end justify-between px-5 pb-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 rounded-sm" style={{ background: "var(--mf-text-muted)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--mf-text-muted)" }} />
            </div>
          </div>

          {/* App content */}
          <div className="px-4 pt-2 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[8px]" style={{ color: "var(--mf-text-muted)" }}>Oi, Wilder</p>
                <p className="text-xs font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Como vai hoje?</p>
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>W</div>
            </div>

            {/* Goal card with streak */}
            <div
              className="rounded-xl p-3 mb-3"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-semibold" style={{ color: "var(--mf-text)" }}>Parar de beber</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>ativo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3 h-3" style={{ color: "var(--forest)" }} />
                <span className="text-[10px] font-mono font-bold" style={{ color: "var(--forest)" }}>12 dias</span>
                <span className="text-[8px]" style={{ color: "var(--mf-text-muted)" }}>🔥</span>
              </div>
            </div>

            {/* Check-in mini */}
            <div
              className="rounded-xl p-3 mb-3"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <p className="text-[9px] font-semibold mb-2" style={{ color: "var(--mf-text)" }}>Como foi hoje?</p>
              <div className="flex justify-between px-1">
                {["😔", "😕", "😐", "🙂", "😊"].map((e, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{
                      background: i === 3 ? "rgba(45,106,79,0.12)" : "transparent",
                      border: i === 3 ? "1.5px solid var(--forest)" : "1.5px solid transparent",
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement mini */}
            <div
              className="rounded-xl p-2.5 flex items-center gap-2"
              style={{ background: "rgba(255,183,3,0.08)", border: "1px solid rgba(255,183,3,0.2)" }}
            >
              <span className="text-sm">🏆</span>
              <div>
                <p className="text-[8px] font-semibold" style={{ color: "var(--amber)" }}>Quinzena!</p>
                <p className="text-[7px]" style={{ color: "var(--mf-text-muted)" }}>14 dias de streak</p>
              </div>
            </div>
          </div>

          {/* Bottom tab bar */}
          <div className="h-12 flex items-center justify-around border-t" style={{ borderColor: "var(--mf-border-subtle)" }}>
            {[
              { icon: Home, active: true },
              { icon: CalendarDays, active: false },
              { icon: Plus, active: false, isMain: true },
              { icon: Users, active: false },
              { icon: UserCircle, active: false },
            ].map((tab, i) => (
              <div key={i} className="flex items-center justify-center">
                {tab.isMain ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center -mt-2" style={{ background: "var(--forest)" }}>
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <tab.icon className="w-4 h-4" style={{ color: tab.active ? "var(--forest)" : "var(--mf-text-muted)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
