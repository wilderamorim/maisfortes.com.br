"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Check, Copy, X } from "lucide-react";

export function AddFriendButton() {
  const [showInput, setShowInput] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGenerateLink() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const url = `${window.location.origin}/invite/friend/${user.id}`;
    setLink(url);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      prompt("Copie o link:", url);
    }

    if (navigator.share) {
      navigator.share({
        title: "+Fortes — Adicionar amigo",
        text: "Me adicione no +Fortes para acompanharmos nossos streaks!",
        url,
      }).catch(() => {});
    }

    setLoading(false);
  }

  if (link) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
              if (navigator.vibrate) navigator.vibrate(30);
              setTimeout(() => setCopied(false), 3000);
            } catch {
              prompt("Copie o link:", link);
            }
          }}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95"
          style={{ color: copied ? "var(--forest)" : "var(--mf-text-muted)" }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
        <button
          onClick={() => setLink(null)}
          className="p-1 rounded"
          style={{ color: "var(--mf-text-muted)" }}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleGenerateLink}
      disabled={loading}
      className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95"
      style={{ color: "var(--forest)" }}
    >
      <UserPlus className="w-3.5 h-3.5" />
      {loading ? "Gerando..." : "Adicionar"}
    </button>
  );
}
