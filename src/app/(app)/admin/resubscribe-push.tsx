"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw, Check, X } from "lucide-react";

export function ResubscribePush() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [detail, setDetail] = useState("");

  async function handleResubscribe() {
    setStatus("loading");
    setDetail("");

    try {
      // Check browser support
      if (!("Notification" in window)) {
        setStatus("error");
        setDetail("Navegador não suporta notificações");
        return;
      }

      if (!("serviceWorker" in navigator)) {
        setStatus("error");
        setDetail("Service Worker não disponível");
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        setDetail(`Permissão: ${permission}. Verifique as configurações do navegador.`);
        return;
      }

      // Get service worker
      const reg = await navigator.serviceWorker.ready;

      // Subscribe
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setStatus("error");
        setDetail("VAPID key não configurada");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      // Save to database
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("error");
        setDetail("Não autenticado");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({ push_subscription: sub.toJSON() })
        .eq("id", user.id);

      if (error) {
        setStatus("error");
        setDetail(error.message);
        return;
      }

      setStatus("ok");
      setDetail(`Endpoint: ...${sub.endpoint.slice(-30)}`);
    } catch (e) {
      setStatus("error");
      setDetail(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3"
      style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
    >
      <div className="flex items-center gap-3">
        <RefreshCw className="w-4 h-4" style={{ color: "var(--amber)" }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>Re-registrar push</p>
          <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
            {detail || "Força novo registro da subscription no banco"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === "ok" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>OK</span>
        )}
        {status === "error" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>Erro</span>
        )}
        <button
          onClick={handleResubscribe}
          disabled={status === "loading"}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
          style={{ background: "rgba(255,183,3,0.08)", color: "var(--amber)" }}
        >
          {status === "loading" ? "..." : "Registrar"}
        </button>
      </div>
    </div>
  );
}
