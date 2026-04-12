"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  isAdmin, testPushNotification, testEmailTemplate, getAdminStats,
} from "@/lib/actions/admin";
import { ArrowLeft, Bell, Mail, BarChart3, Loader2 } from "lucide-react";
import Link from "next/link";
import { ResubscribePush } from "./resubscribe-push";

type Result = { success: boolean; error?: string } | null;

function ResultBadge({ result }: { result: Result }) {
  if (!result) return null;
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-mono"
      style={{
        background: result.success ? "rgba(45,106,79,0.1)" : "rgba(229,56,59,0.08)",
        color: result.success ? "var(--forest)" : "var(--danger)",
      }}
    >
      {result.success ? "Enviado" : result.error || "Erro"}
    </span>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [pushResult, setPushResult] = useState<Result>(null);
  const [emailResults, setEmailResults] = useState<Record<string, Result>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const admin = await isAdmin();
    if (!admin) { router.push("/home"); return; }
    setAuthorized(true);
    setLoading(false);
    loadStats();
  }

  async function loadStats() {
    const data = await getAdminStats();
    setStats(data);
  }

  async function handlePush() {
    setActionLoading("push");
    try {
      const result = await testPushNotification();
      setPushResult(result);
    } catch (e) {
      setPushResult({ success: false, error: e instanceof Error ? e.message : "Erro" });
    }
    setActionLoading(null);
  }

  async function handleEmail(template: string) {
    setActionLoading(template);
    try {
      const result = await testEmailTemplate(template);
      setEmailResults((prev) => ({ ...prev, [template]: result }));
    } catch (e) {
      setEmailResults((prev) => ({ ...prev, [template]: { success: false, error: e instanceof Error ? e.message : "Erro" } }));
    }
    setActionLoading(null);
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--mf-border-subtle)", borderTopColor: "var(--forest)" }} />
      </div>
    );
  }

  const EMAIL_TEMPLATES = [
    { id: "daily-reminder", label: "Lembrete diário", desc: "\"Ei, como foi hoje?\" — template de check-in" },
    { id: "inactivity-alert", label: "Alerta de inatividade", desc: "\"João não faz check-in há 3 dias\" — para apoiadores" },
    { id: "weekly-report", label: "Resumo semanal", desc: "5 check-ins, score 3.8, streak 12, 2 metas — dados fake" },
    { id: "difficult-day", label: "Dia difícil", desc: "\"Maria está tendo um dia difícil\" — alerta para apoiador" },
  ];

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto pb-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="p-2 -ml-2 rounded-lg" style={{ color: "var(--mf-text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Admin
        </h1>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4" style={{ color: "var(--forest)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>Estatísticas</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Usuários", value: stats.users },
              { label: "Metas ativas", value: stats.activeGoals },
              { label: "Check-ins", value: stats.totalCheckins },
              { label: "Apoiadores", value: stats.activeSupporters },
              { label: "Ofensivas", value: stats.activeFriendStreaks },
              { label: "Notificações", value: stats.totalNotifications },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
              >
                <p className="text-lg font-bold font-mono" style={{ color: "var(--forest)" }}>{s.value}</p>
                <p className="text-[9px]" style={{ color: "var(--mf-text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Push */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4" style={{ color: "var(--forest)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>Push notification</h2>
        </div>
        <div className="space-y-2">
          <ResubscribePush />
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>Enviar push de teste</p>
              <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>Envia para seu dispositivo</p>
            </div>
            <div className="flex items-center gap-2">
              <ResultBadge result={pushResult} />
              <button
                onClick={handlePush}
                disabled={actionLoading === "push"}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}
              >
                {actionLoading === "push" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Testar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email templates */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4" style={{ color: "var(--coral)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>Testar templates de email</h2>
          <span className="text-[9px]" style={{ color: "var(--mf-text-muted)" }}>— envia só para você</span>
        </div>
        <div className="space-y-2">
          {EMAIL_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>{tmpl.label}</p>
                <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>{tmpl.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <ResultBadge result={emailResults[tmpl.id]} />
                <button
                  onClick={() => handleEmail(tmpl.id)}
                  disabled={actionLoading === tmpl.id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                  style={{ background: "rgba(244,132,95,0.08)", color: "var(--coral)" }}
                >
                  {actionLoading === tmpl.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enviar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
