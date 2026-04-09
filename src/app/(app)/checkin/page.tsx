"use client";

import { SCORE_OPTIONS } from "@/lib/types";
import { useState } from "react";

export default function CheckinPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <p className="text-xs font-mono capitalize mb-1" style={{ color: "var(--text-muted)" }}>
          {today}
        </p>
        <h1 className="text-xl font-bold mb-6" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Como foi seu dia?
        </h1>

        {/* Score selector */}
        <div className="flex justify-between mb-6">
          {SCORE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all active:scale-95"
              style={{
                background: selected === opt.value ? "rgba(45,106,79,0.12)" : "transparent",
                border: selected === opt.value ? "2px solid var(--forest)" : "2px solid transparent",
              }}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Note */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nota (opcional)..."
          maxLength={500}
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none mb-4 outline-none transition-all focus:ring-2"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />

        {/* Submit */}
        <button
          disabled={selected === null}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: selected !== null ? "var(--forest)" : "var(--text-muted)",
            boxShadow: selected !== null ? "var(--shadow-glow)" : "none",
          }}
        >
          Registrar check-in
        </button>
      </div>
    </div>
  );
}
