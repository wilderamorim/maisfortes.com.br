"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createFriendStreak } from "@/lib/actions/friend-streaks";
import { TARGET_DAYS_OPTIONS } from "@/lib/types";
import { UserPlus, Check, Copy, X, Eye, EyeOff } from "lucide-react";

interface GoalOption {
  id: string;
  title: string;
}

export function AddFriendButton() {
  const [step, setStep] = useState<"idle" | "setup" | "link">("idle");
  const [goals, setGoals] = useState<GoalOption[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [goalVisible, setGoalVisible] = useState(true);
  const [targetDays, setTargetDays] = useState(30);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === "setup") {
      loadGoals();
    }
  }, [step]);

  async function loadGoals() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("goals")
      .select("id, title")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("order");

    const g = data ?? [];
    setGoals(g);
    if (g.length === 1) setSelectedGoal(g[0].id);
  }

  async function handleCreate() {
    if (!selectedGoal) return;
    setLoading(true);

    try {
      const streakId = await createFriendStreak({
        goalId: selectedGoal,
        goalVisible,
        targetDays,
      });

      const url = `${window.location.origin}/invite/friend/${streakId}`;
      setLink(url);
      setStep("link");

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        if (navigator.vibrate) navigator.vibrate(30);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        prompt("Copie o link:", url);
      }

      if (navigator.share) {
        navigator.share({
          title: "+Fortes — Ofensiva de amigos",
          text: `Me acompanhe numa ofensiva de ${targetDays} dias no +Fortes!`,
          url,
        }).catch(() => {});
      }
    } catch {
      // Silently fail
    }

    setLoading(false);
  }

  function handleClose() {
    setStep("idle");
    setLink(null);
    setSelectedGoal("");
    setGoalVisible(true);
    setTargetDays(30);
    setCopied(false);
  }

  if (step === "link" && link) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
              if (navigator.vibrate) navigator.vibrate(30);
              setTimeout(() => setCopied(false), 3000);
            } catch {
              prompt("Copie o link:", link);
            }
          }}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95"
          style={{ color: copied ? "var(--forest)" : "var(--mf-text-muted)" }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
        <button onClick={handleClose} className="p-1 rounded" style={{ color: "var(--mf-text-muted)" }}>
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (step === "setup") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div
          className="w-full max-w-lg rounded-t-2xl p-5 pb-8 space-y-4 animate-slide-up"
          style={{ background: "var(--mf-surface)", borderTop: "1px solid var(--mf-border-subtle)" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Nova ofensiva de amigos
            </h3>
            <button onClick={handleClose} className="p-1 rounded" style={{ color: "var(--mf-text-muted)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Goal selection */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--mf-text-muted)" }}>
              Sua meta
            </label>
            {goals.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
                Crie uma meta primeiro.
              </p>
            ) : (
              <div className="space-y-1.5">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: selectedGoal === g.id ? "rgba(45,106,79,0.12)" : "var(--mf-bg)",
                      border: selectedGoal === g.id ? "2px solid var(--forest)" : "2px solid var(--mf-border-subtle)",
                      color: "var(--mf-text)",
                    }}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Visibility toggle */}
          <button
            onClick={() => setGoalVisible(!goalVisible)}
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--mf-text-muted)" }}
          >
            {goalVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {goalVisible ? "Meta visível para o amigo" : "Meta privada (amigo não verá o nome)"}
          </button>

          {/* Target days */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--mf-text-muted)" }}>
              Duração
            </label>
            <div className="flex flex-wrap gap-2">
              {TARGET_DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setTargetDays(d)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                  style={{
                    background: targetDays === d ? "var(--forest)" : "var(--mf-bg)",
                    color: targetDays === d ? "white" : "var(--mf-text-muted)",
                    border: `1px solid ${targetDays === d ? "var(--forest)" : "var(--mf-border-subtle)"}`,
                  }}
                >
                  {d} dias
                </button>
              ))}
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            disabled={!selectedGoal || loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ background: "var(--forest)" }}
          >
            {loading ? "Criando..." : "Criar e compartilhar link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setStep("setup")}
      className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95"
      style={{ color: "var(--forest)" }}
    >
      <UserPlus className="w-3.5 h-3.5" />
      Convidar
    </button>
  );
}
