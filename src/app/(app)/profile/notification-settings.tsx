"use client";

import { Bell, Clock } from "lucide-react";

export function NotificationSettingsRow({ hasPush }: { hasPush: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ color: "var(--mf-text)" }}>
      <Bell className="w-5 h-5" style={{ color: "var(--mf-text-muted)" }} />
      <div className="flex-1">
        <span className="text-sm font-medium">Lembrete diário</span>
        {!hasPush && (
          <p className="text-[10px] mt-0.5" style={{ color: "var(--coral)" }}>
            Ative as notificações push para receber lembretes
          </p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" style={{ color: "var(--mf-text-muted)" }} />
        <span className="text-xs font-mono" style={{ color: "var(--mf-text-muted)" }}>18:00</span>
      </div>
    </div>
  );
}
