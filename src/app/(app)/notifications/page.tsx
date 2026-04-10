"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Bell, Check, Flame, Trophy, Users, MessageCircle, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { AppNotification } from "@/lib/actions/in-app-notifications";

const iconMap: Record<string, typeof Bell> = {
  checkin_reminder: Calendar,
  streak_milestone: Flame,
  achievement_unlocked: Trophy,
  supporter_joined: Users,
  supporter_message: MessageCircle,
  supporter_reaction: MessageCircle,
  inactivity_alert: AlertTriangle,
  weekly_summary: Calendar,
  friend_streak_broken: Flame,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        setNotifications((data ?? []) as AppNotification[]);

        // Mark all as read
        const unread = (data ?? []).filter((n: AppNotification) => !n.read_at).map((n: AppNotification) => n.id);
        if (unread.length > 0) {
          await supabase
            .from("notifications")
            .update({ read_at: new Date().toISOString() })
            .in("id", unread);
        }
      } catch {
        // Table might not exist
      }
      setLoading(false);
    }
    load();
  }, []);

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto pb-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home" className="p-2 -ml-2 rounded-lg" style={{ color: "var(--mf-text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Notificações
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>Carregando...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
          <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--mf-text-muted)" }} />
          <h2 className="font-semibold mb-1" style={{ color: "var(--mf-text)" }}>Nenhuma notificação</h2>
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>
            Suas notificações aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Bell;
            const isUnread = !n.read_at;
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isUnread ? "rgba(45,106,79,0.04)" : "transparent",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: isUnread ? "rgba(45,106,79,0.1)" : "var(--mf-surface)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: isUnread ? "var(--forest)" : "var(--mf-text-muted)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>{n.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--mf-text-muted)" }}>{n.body}</p>
                </div>
                <span className="text-[10px] font-mono shrink-0 mt-1" style={{ color: "var(--mf-text-muted)" }}>
                  {timeAgo(n.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
