"use client";

import { useState } from "react";
import { createInvite } from "@/lib/actions/supporters";
import { Link2, Check, Copy } from "lucide-react";

export function InviteButton({ goalId }: { goalId: string }) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInvite() {
    setLoading(true);
    setError(null);
    try {
      const code = await createInvite(goalId);
      const url = `${window.location.origin}/invite/${code}`;
      setLink(url);

      // Copy to clipboard immediately
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        if (navigator.vibrate) navigator.vibrate(30);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // Clipboard failed, user can still copy manually
      }

      // Also try native share on mobile (non-blocking)
      if (navigator.share) {
        navigator.share({
          title: "+Fortes — Convite",
          text: "Acompanhe minha jornada no +Fortes",
          url,
        }).catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar convite");
    }
    setLoading(false);
  }

  async function handleCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback: select text
      prompt("Copie o link:", link);
    }
  }

  if (error) {
    return (
      <span className="text-[10px]" style={{ color: "var(--danger)" }}>{error}</span>
    );
  }

  if (link) {
    return (
      <button
        onClick={handleCopy}
        className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95"
        style={{ color: copied ? "var(--forest)" : "var(--mf-text-muted)" }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    );
  }

  return (
    <button
      onClick={handleInvite}
      disabled={loading}
      className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95"
      style={{ color: "var(--forest)" }}
    >
      <Link2 className="w-3.5 h-3.5" />
      {loading ? "Gerando..." : "Convidar"}
    </button>
  );
}
