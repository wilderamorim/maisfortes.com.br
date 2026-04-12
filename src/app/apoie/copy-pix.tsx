"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyPixButton({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      prompt("Copie a chave:", pixKey);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95"
      style={{
        background: copied ? "rgba(45,106,79,0.1)" : "rgba(45,106,79,0.06)",
        color: copied ? "var(--forest)" : "var(--mf-text-muted)",
      }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copiado!" : "Copiar chave"}
    </button>
  );
}
