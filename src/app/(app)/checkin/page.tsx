"use client";

import { SCORE_OPTIONS } from "@/lib/types";
import { createCheckin, getGoalsForCheckin } from "@/lib/actions/checkins";
import { getSupportersForGoal } from "@/lib/actions/supporters";
import { sendMessage } from "@/lib/actions/messages";
import { getFriendStreaksForGoal, nudgeFriend } from "@/lib/actions/friend-streaks";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Heart, MessageCircle, Phone, Flame, Target, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function CheckinPage() {
  return (
    <Suspense fallback={null}>
      <CheckinContent />
    </Suspense>
  );
}

function CheckinContent() {
  const searchParams = useSearchParams();
  const goalIdParam = searchParams.get("goal");
  const router = useRouter();

  const [goalId, setGoalId] = useState<string | null>(goalIdParam);
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [difficultDay, setDifficultDay] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [sendingAlert, setSendingAlert] = useState(false);
  const [friendStreaks, setFriendStreaks] = useState<{ id: string; friend_name: string; friend_checked_today: boolean; current_streak: number; target_days: number }[]>([]);
  const [nudgedIds, setNudgedIds] = useState<Set<string>>(new Set());

  // Goal picker state (when no goalId)
  const [pendingGoals, setPendingGoals] = useState<{ id: string; title: string; current_streak: number }[]>([]);
  const [doneGoals, setDoneGoals] = useState<{ id: string; title: string; current_streak: number }[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(!goalIdParam);

  useEffect(() => {
    if (!goalIdParam) {
      loadGoals();
    }
  }, [goalIdParam]);

  async function loadGoals() {
    setLoadingGoals(true);
    try {
      const { pending, done } = await getGoalsForCheckin();
      setPendingGoals(pending);
      setDoneGoals(done);
      // Auto-select if only 1 pending
      if (pending.length === 1) {
        setGoalId(pending[0].id);
      }
    } catch {
      // Silently fail
    }
    setLoadingGoals(false);
  }

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  async function handleSubmit() {
    if (selected === null || !goalId) return;

    setLoading(true);
    try {
      const scoreOption = SCORE_OPTIONS.find((o) => o.value === selected);
      await createCheckin({
        goalId,
        score: selected,
        mood: scoreOption?.mood ?? "neutral",
        note: note.trim() || undefined,
      });
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(50);

      if (selected === 1) {
        setDifficultDay(true);
        setLoading(false);
        return;
      }

      // Load friend streaks for this goal before showing success
      let streaks: typeof friendStreaks = [];
      if (goalId) {
        streaks = await getFriendStreaksForGoal(goalId);
        setFriendStreaks(streaks);
      }

      setSuccess(true);
      if (streaks.length === 0) {
        setTimeout(() => router.push("/home"), 1500);
      }
    } catch {
      setLoading(false);
    }
  }

  // No goal param — show goal picker
  if (!goalId && !goalIdParam) {
    if (loadingGoals) {
      return (
        <div className="px-4 pt-6 max-w-lg mx-auto">
          <p style={{ color: "var(--mf-text-muted)" }}>Carregando...</p>
        </div>
      );
    }

    // No goals at all
    if (pendingGoals.length === 0 && doneGoals.length === 0) {
      return (
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: "rgba(45,106,79,0.1)" }}
            >
              <Target className="w-10 h-10" style={{ color: "var(--forest)" }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Crie sua primeira meta
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--mf-text-muted)" }}>
              Para fazer check-in, você precisa ter uma meta ativa.
            </p>
            <Link
              href="/goals"
              className="inline-block w-full py-3 rounded-xl text-white font-semibold text-sm text-center transition-all active:scale-[0.98]"
              style={{ background: "var(--forest)" }}
            >
              Criar meta
            </Link>
          </div>
        </div>
      );
    }

    // All goals done for today
    if (pendingGoals.length === 0 && doneGoals.length > 0) {
      return (
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: "rgba(45,106,79,0.1)" }}
            >
              <PartyPopper className="w-10 h-10" style={{ color: "var(--forest)" }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Tudo feito por hoje!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--mf-text-muted)" }}>
              Você já fez check-in em todas as suas metas. Descanse, você merece.
            </p>
            <button
              onClick={() => router.push("/home")}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98]"
              style={{ background: "var(--forest)" }}
            >
              Voltar para Home
            </button>
          </div>
        </div>
      );
    }

    // Multiple pending goals — show picker
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/home" className="p-2 -ml-2 rounded-lg" style={{ color: "var(--mf-text-muted)" }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Check-in
          </h1>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--mf-text-muted)" }}>
          Qual meta você quer registrar?
        </p>

        <div className="space-y-2">
          {pendingGoals.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoalId(g.id)}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all active:scale-[0.98]"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(45,106,79,0.1)" }}
              >
                <Flame className="w-4 h-4" style={{ color: "var(--forest)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--mf-text)" }}>{g.title}</p>
                <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
                  {g.current_streak > 0 ? `${g.current_streak} dias de streak` : "Sem streak ativo"}
                </p>
              </div>
            </button>
          ))}
        </div>

        {doneGoals.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-medium mb-2" style={{ color: "var(--mf-text-muted)" }}>
              Feitos hoje
            </p>
            <div className="space-y-1.5">
              {doneGoals.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 opacity-60"
                  style={{ background: "var(--mf-surface)" }}
                >
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--forest)" }} />
                  <span className="text-sm truncate" style={{ color: "var(--mf-text)" }}>{g.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  async function handleAlertNetwork() {
    if (!goalId) return;
    setSendingAlert(true);
    try {
      const supporters = await getSupportersForGoal(goalId);
      for (const s of supporters) {
        await sendMessage({
          goalId,
          toUserId: s.user_id,
          content: "Estou tendo um dia difícil e preciso de apoio. 💙",
        });
      }
      setAlertSent(true);
    } catch {
      // Silently fail
    }
    setSendingAlert(false);
  }

  if (difficultDay) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(244,132,95,0.12)" }}
          >
            <Heart className="w-10 h-10" style={{ color: "var(--coral)" }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Dias assim fazem parte.
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--mf-text-muted)" }}>
            Registrar que está difícil já é um ato de coragem. Amanhã é um novo dia.
          </p>

          <div className="space-y-3">
            {!alertSent ? (
              <button
                onClick={handleAlertNetwork}
                disabled={sendingAlert}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-white"
                style={{ background: "var(--coral)" }}
              >
                <MessageCircle className="w-4 h-4" />
                {sendingAlert ? "Enviando..." : "Avisar minha rede de apoio"}
              </button>
            ) : (
              <div
                className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}
              >
                <Check className="w-4 h-4" />
                Sua rede foi avisada 💙
              </div>
            )}

            <a
              href="tel:188"
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ border: "1px solid var(--mf-border)", color: "var(--mf-text-secondary)" }}
            >
              <Phone className="w-4 h-4" />
              CVV — Ligue 188 (24h)
            </a>

            <button
              onClick={() => {
                setSuccess(true);
                setTimeout(() => router.push("/home"), 1500);
              }}
              className="w-full py-3 text-sm transition-all"
              style={{ color: "var(--mf-text-muted)" }}
            >
              Continuar para a Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    const hasStreaks = friendStreaks.length > 0;
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="text-center animate-scale-in w-full max-w-sm">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(45,106,79,0.1)" }}
          >
            <Check className="w-10 h-10" style={{ color: "var(--forest)" }} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Check-in registrado!
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--mf-text-muted)" }}>
            Mais um dia. Você está mais forte.
          </p>

          {/* Friend streaks status */}
          {hasStreaks && (
            <div className="space-y-2 mb-6">
              {friendStreaks.map((fs) => (
                <div
                  key={fs.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left"
                  style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
                >
                  <Flame className="w-4 h-4 flex-shrink-0" style={{ color: "var(--forest)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--mf-text)" }}>
                      Ofensiva com {fs.friend_name}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
                      {fs.current_streak}/{fs.target_days} dias
                    </p>
                  </div>
                  {fs.friend_checked_today ? (
                    <span className="text-[10px] flex-shrink-0" style={{ color: "var(--forest)" }}>
                      ✅ Fez!
                    </span>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          await nudgeFriend(fs.id);
                          setNudgedIds((prev) => new Set([...prev, fs.id]));
                          if (navigator.vibrate) navigator.vibrate(30);
                        } catch { /* already nudged */ }
                      }}
                      disabled={nudgedIds.has(fs.id)}
                      className="text-[10px] px-2 py-1 rounded-lg flex-shrink-0 transition-all active:scale-95"
                      style={{
                        background: nudgedIds.has(fs.id) ? "transparent" : "rgba(45,106,79,0.1)",
                        color: "var(--forest)",
                      }}
                    >
                      {nudgedIds.has(fs.id) ? "👋 Cutucado!" : "👋 Cutucar"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => router.push("/home")}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] text-white"
            style={{ background: "var(--forest)" }}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home" className="p-2 -ml-2 rounded-lg" style={{ color: "var(--mf-text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Check-in
        </h1>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--mf-surface)",
          border: "1px solid var(--mf-border-subtle)",
          boxShadow: "var(--mf-shadow-md)",
        }}
      >
        <p className="text-xs font-mono capitalize mb-1" style={{ color: "var(--mf-text-muted)" }}>
          {today}
        </p>
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Como foi seu dia?
        </h2>

        {/* Score selector */}
        <div className="flex justify-between mb-6">
          {SCORE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSelected(opt.value);
                if (navigator.vibrate) navigator.vibrate(10);
              }}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all active:scale-95"
              style={{
                background: selected === opt.value ? "rgba(45,106,79,0.12)" : "transparent",
                border: selected === opt.value ? "2px solid var(--forest)" : "2px solid transparent",
                transform: selected === opt.value ? "scale(1.05)" : "scale(1)",
              }}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>{opt.label}</span>
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
          className="w-full rounded-xl px-4 py-3 text-sm resize-none mb-4 outline-none transition-all"
          style={{
            background: "var(--mf-bg)",
            border: "1px solid var(--mf-border)",
            color: "var(--mf-text)",
          }}
        />

        <div className="flex items-center justify-between text-[10px] mb-4" style={{ color: "var(--mf-text-muted)" }}>
          <span>{note.length}/500</span>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selected === null || loading}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: selected !== null ? "var(--forest)" : "var(--mf-text-muted)",
            boxShadow: selected !== null ? "var(--mf-shadow-glow)" : "none",
          }}
        >
          {loading ? "Salvando..." : "Registrar check-in"}
        </button>
      </div>
    </div>
  );
}
