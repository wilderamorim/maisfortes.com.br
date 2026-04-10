"use client";

import { updateNotificationTime } from "@/lib/actions/notification-settings";
import { Bell, Clock } from "lucide-react";
import { useState } from "react";

// BRT offset from UTC (UTC-3)
const BRT_OFFSET = -3;

function utcToBrt(utcHour: number): number {
  return ((utcHour + BRT_OFFSET) % 24 + 24) % 24;
}

function brtToUtc(brtHour: number): number {
  return ((brtHour - BRT_OFFSET) % 24 + 24) % 24;
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function NotificationSettingsRow({
  notificationTimeUtc,
  hasPush,
}: {
  notificationTimeUtc: number;
  hasPush: boolean;
}) {
  const [brtHour, setBrtHour] = useState(utcToBrt(notificationTimeUtc));
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newBrt = parseInt(e.target.value);
    setBrtHour(newBrt);
    setSaving(true);
    try {
      await updateNotificationTime(brtToUtc(newBrt));
    } catch {
      // revert
      setBrtHour(utcToBrt(notificationTimeUtc));
    }
    setSaving(false);
  }

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
        <select
          value={brtHour}
          onChange={handleChange}
          disabled={saving}
          className="text-xs font-mono rounded-lg px-2 py-1 outline-none"
          style={{
            background: "var(--mf-bg)",
            border: "1px solid var(--mf-border)",
            color: "var(--mf-text)",
          }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {formatHour(i)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
