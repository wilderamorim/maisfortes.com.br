"use client";

import { useState } from "react";
import { createInvite } from "@/lib/actions/supporters";
import { Link2, Check, Copy } from "lucide-react";

export function InviteButton({ goalId }: { goalId: string }) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleInvite() {
    setLoading(true);
    try {
      const code = await createInvite(goalId);
      const url = `${window.location.origin}/invite/${code}`;
      setLink(url);

      // Try native share first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: "+Fortes — Convite",
          text: "Fui convidado para acompanhar uma jornada no +Fortes",
          url,
        });
      }
    } catch {
      // Fallback: just show the link
    }
    setLoading(false);
  }

  async function handleCopy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => setCopied(false), 2000);
  }

  if (link) {
    return (
      <button
        onClick={handleCopy}
        className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
        style={{ color: copied ? "var(--forest)" : "var(--text-muted)" }}
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
      className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
      style={{ color: "var(--forest)" }}
    >
      <Link2 className="w-3.5 h-3.5" />
      {loading ? "Gerando..." : "Convidar"}
    </button>
  );
}
