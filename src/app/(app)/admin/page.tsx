"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  isAdmin, testPushNotification, testEmailNotification,
  triggerCron, getAdminStats,
} from "@/lib/actions/admin";
import { ArrowLeft, Bell, Mail, Clock, BarChart3, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { ResubscribePush } from "./resubscribe-push";

type Result = { success: boolean; error?: string; data?: unknown } | null;

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
      {result.success ? "OK" : result.error || "Erro"}
    </span>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [pushResult, setPushResult] = useState<Result>(null);
  const [emailResult, setEmailResult] = useState<Result>(null);
  const [cronResults, setCronResults] = useState<Record<string, Result>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const admin = await isAdmin();
    if (!admin) {
      router.push("/home");
      return;
    }
    setAuthorized(true);
    setLoading(false);
    loadStats();
  }

  async function loadStats() {
    const data = await getAdminStats();
    setStats(data);
  }

  async function handleAction(action: string, fn: () => Promise<Result>) {
    setActionLoading(action);
    try {
      const result = await fn();
      if (action === "push") setPushResult(result);
      else if (action === "email") setEmailResult(result);
      else setCronResults((prev) => ({ ...prev, [action]: result }));
    } catch (e) {
      const err = { success: false, error: e instanceof Error ? e.message : "Erro" };
      if (action === "push") setPushResult(err);
      else if (action === "email") setEmailResult(err);
      else setCronResults((prev) => ({ ...prev, [action]: err }));
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

  const CRONS = [
    { id: "daily-push", label: "Lembrete diário", desc: "Push + email + notificação para quem não fez check-in" },
    { id: "inactivity-alert", label: "Alerta inatividade", desc: "Avisa apoiadores de inatividade 48h+" },
    { id: "friend-streaks", label: "Ofensiva de amigos", desc: "Avalia streaks compartilhados" },
    { id: "weekly-summary", label: "Resumo semanal", desc: "Email + push com stats da semana" },
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

      {/* Test notifications */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--mf-text)" }}>Testar notificações</h2>
        <div className="space-y-2">
          <ResubscribePush />
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" style={{ color: "var(--forest)" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>Push notification</p>
                <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>Envia para seu dispositivo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ResultBadge result={pushResult} />
              <button
                onClick={() => handleAction("push", testPushNotification)}
                disabled={actionLoading === "push"}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}
              >
                {actionLoading === "push" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Testar"}
              </button>
            </div>
          </div>

          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" style={{ color: "var(--coral)" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>Email (Resend)</p>
                <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>Envia para seu email cadastrado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ResultBadge result={emailResult} />
              <button
                onClick={() => handleAction("email", testEmailNotification)}
                disabled={actionLoading === "email"}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                style={{ background: "rgba(244,132,95,0.08)", color: "var(--coral)" }}
              >
                {actionLoading === "email" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Testar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Crons */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" style={{ color: "var(--amber)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>Disparar crons</h2>
        </div>
        <div className="space-y-2">
          {CRONS.map((cron) => (
            <div
              key={cron.id}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>{cron.label}</p>
                <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>{cron.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <ResultBadge result={cronResults[cron.id]} />
                <button
                  onClick={() => handleAction(cron.id, () => triggerCron(cron.id))}
                  disabled={actionLoading === cron.id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                  style={{ background: "rgba(255,183,3,0.08)", color: "var(--amber)" }}
                >
                  {actionLoading === cron.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Executar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
