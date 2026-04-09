"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGoal } from "@/lib/actions/goals";
import { createClient } from "@/lib/supabase/client";
import { SCORE_OPTIONS } from "@/lib/types";
import { createCheckin } from "@/lib/actions/checkins";
import { ArrowRight, SkipForward } from "lucide-react";

const steps = [
  { title: "Qual é sua meta?", subtitle: "Descreva o que você quer mudar" },
  { title: "Quer convidar alguém?", subtitle: "Apoio é opcional — pule se preferir" },
  { title: "Como está se sentindo?", subtitle: "Seu primeiro check-in" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreateGoal() {
    if (!goalTitle.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("title", goalTitle.trim());
      if (goalDesc.trim()) formData.set("description", goalDesc.trim());
      await createGoal(formData);

      // Get the created goal ID
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("goals")
          .select("id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (data) setGoalId(data.id);
      }
      setStep(1);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleCheckin() {
    if (score === null || !goalId) return;
    setLoading(true);
    try {
      const opt = SCORE_OPTIONS.find((o) => o.value === score);
      await createCheckin({ goalId, score, mood: opt?.mood ?? "neutral" });

      // Mark onboarding complete
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("users").update({ onboarding_completed: true }).eq("id", user.id);
      }

      if (navigator.vibrate) navigator.vibrate(50);
      router.push("/home");
    } catch { /* ignore */ }
    setLoading(false);
  }

  return (
    <div className="min-h-dvh flex flex-col px-4 pt-12 pb-8 max-w-sm mx-auto" style={{ background: "var(--bg)" }}>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === step ? "32px" : "8px",
              background: i <= step ? "var(--forest)" : "var(--border)",
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          {steps[step].title}
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          {steps[step].subtitle}
        </p>

        {/* Step 0: Create goal */}
        {step === 0 && (
          <div className="space-y-4">
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Ex: Parar de beber, Emagrecer..."
              maxLength={100}
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <textarea
              value={goalDesc}
              onChange={(e) => setGoalDesc(e.target.value)}
              placeholder="Por que isso é importante? (opcional)"
              rows={2}
              maxLength={300}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button
              onClick={handleCreateGoal}
              disabled={loading || !goalTitle.trim()}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: "var(--forest)" }}
            >
              {loading ? "Criando..." : "Próximo"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1: Invite (skippable) */}
        {step === 1 && (
          <div className="space-y-4">
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
            >
              <p className="text-sm mb-4" style={{ color: "var(--text)" }}>
                Convide quem te apoia — família, amigos, parceiro(a). Eles vão acompanhar sua jornada sem invadir.
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Você pode fazer isso depois nas configurações.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <SkipForward className="w-4 h-4" /> Pular por agora
            </button>
          </div>
        )}

        {/* Step 2: First check-in */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between">
              {SCORE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setScore(opt.value);
                    if (navigator.vibrate) navigator.vibrate(10);
                  }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all active:scale-95"
                  style={{
                    background: score === opt.value ? "rgba(45,106,79,0.12)" : "transparent",
                    border: score === opt.value ? "2px solid var(--forest)" : "2px solid transparent",
                  }}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{opt.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleCheckin}
              disabled={score === null || loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
            >
              {loading ? "Salvando..." : "Começar minha jornada"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
