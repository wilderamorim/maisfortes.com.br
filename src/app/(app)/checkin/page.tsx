"use client";

import { SCORE_OPTIONS } from "@/lib/types";
import { createCheckin } from "@/lib/actions/checkins";
import { getSupportersForGoal } from "@/lib/actions/supporters";
import { sendMessage } from "@/lib/actions/messages";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Heart, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 max-w-lg mx-auto"><p style={{ color: "var(--mf-text-muted)" }}>Carregando...</p></div>}>
      <CheckinContent />
    </Suspense>
  );
}

function CheckinContent() {
  const searchParams = useSearchParams();
  const goalId = searchParams.get("goal");
  const router = useRouter();

  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [difficultDay, setDifficultDay] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [sendingAlert, setSendingAlert] = useState(false);

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

      setSuccess(true);
      setTimeout(() => router.push("/home"), 1500);
    } catch {
      setLoading(false);
    }
  }

  if (!goalId) {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/home" className="p-2 -ml-2 rounded-lg" style={{ color: "var(--mf-text-muted)" }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Check-in
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>
          Selecione uma meta na Home para fazer o check-in.
        </p>
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
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="text-center animate-scale-in">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(45,106,79,0.1)" }}
          >
            <Check className="w-10 h-10" style={{ color: "var(--forest)" }} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Check-in registrado!
          </h2>
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>
            Mais um dia. Você está mais forte.
          </p>
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
