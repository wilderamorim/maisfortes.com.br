"use client";

import { useState } from "react";
import { updateSupporterPrivacy, removeSupporter } from "@/lib/actions/supporters";
import { Settings, Eye, EyeOff, FileText, Trash2, X } from "lucide-react";

export function SupporterConfig({
  supporterId,
  name,
  canSeeScore,
  canSeeNotes,
}: {
  supporterId: string;
  name: string;
  canSeeScore: boolean;
  canSeeNotes: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(canSeeScore);
  const [notes, setNotes] = useState(canSeeNotes);
  const [saving, setSaving] = useState(false);

  async function handleToggle(field: "score" | "notes") {
    const newScore = field === "score" ? !score : score;
    const newNotes = field === "notes" ? !notes : notes;
    if (field === "score") setScore(newScore);
    if (field === "notes") setNotes(newNotes);

    setSaving(true);
    try {
      await updateSupporterPrivacy(supporterId, newScore, newNotes);
    } catch {
      // Revert
      if (field === "score") setScore(score);
      if (field === "notes") setNotes(notes);
    }
    setSaving(false);
  }

  async function handleRemove() {
    if (!confirm(`Remover ${name} como apoiador?`)) return;
    await removeSupporter(supporterId);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="p-1 rounded-lg transition-all active:scale-90"
        style={{ color: "var(--mf-text-muted)" }}
      >
        <Settings className="w-3.5 h-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-8 z-50 rounded-xl py-2 min-w-[200px] shadow-lg"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <p className="px-4 pb-2 text-[10px] font-semibold" style={{ color: "var(--mf-text-muted)" }}>
              O que {name} pode ver
            </p>

            <button
              onClick={() => handleToggle("score")}
              disabled={saving}
              className="flex items-center gap-2 w-full px-4 py-2 text-xs text-left"
              style={{ color: "var(--mf-text)" }}
            >
              {score ? <Eye className="w-3.5 h-3.5" style={{ color: "var(--forest)" }} /> : <EyeOff className="w-3.5 h-3.5" style={{ color: "var(--mf-text-muted)" }} />}
              Score e humor
              <span className="ml-auto text-[10px] font-mono" style={{ color: score ? "var(--forest)" : "var(--mf-text-muted)" }}>
                {score ? "sim" : "não"}
              </span>
            </button>

            <button
              onClick={() => handleToggle("notes")}
              disabled={saving}
              className="flex items-center gap-2 w-full px-4 py-2 text-xs text-left"
              style={{ color: "var(--mf-text)" }}
            >
              {notes ? <FileText className="w-3.5 h-3.5" style={{ color: "var(--forest)" }} /> : <FileText className="w-3.5 h-3.5" style={{ color: "var(--mf-text-muted)" }} />}
              Notas do check-in
              <span className="ml-auto text-[10px] font-mono" style={{ color: notes ? "var(--forest)" : "var(--mf-text-muted)" }}>
                {notes ? "sim" : "não"}
              </span>
            </button>

            <div className="h-px my-1" style={{ background: "var(--mf-border)" }} />

            <button
              onClick={handleRemove}
              className="flex items-center gap-2 w-full px-4 py-2 text-xs text-left"
              style={{ color: "var(--danger)" }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remover apoiador
            </button>
          </div>
        </>
      )}
    </div>
  );
}
