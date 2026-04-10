"use client";

import { markMessagesAsRead } from "@/lib/actions/messages";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";

type Message = {
  id: string;
  type: "message" | "reaction";
  content: string;
  reaction_emoji: string | null;
  read_at: string | null;
  created_at: string;
  from_user: { name: string | null; avatar_url: string | null } | null;
};

export function SupportMessages({ messages }: { messages: Message[] }) {
  const unread = messages.filter((m) => !m.read_at);

  useEffect(() => {
    if (unread.length > 0) {
      markMessagesAsRead(unread.map((m) => m.id));
    }
  }, []);

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4" style={{ color: "var(--forest)" }} />
        <h2 className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>
          Apoio recebido
        </h2>
        {unread.length > 0 && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-mono text-white"
            style={{ background: "var(--coral)" }}
          >
            {unread.length}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {messages.map((msg) => {
          const name = msg.from_user?.name || "Apoiador";
          const initial = name[0]?.toUpperCase() || "?";
          const isReaction = msg.type === "reaction";

          return (
            <div
              key={msg.id}
              className="flex items-start gap-3 rounded-xl p-3 transition-all"
              style={{
                background: msg.read_at ? "var(--mf-surface)" : "rgba(45,106,79,0.05)",
                border: `1px solid ${msg.read_at ? "var(--mf-border-subtle)" : "rgba(45,106,79,0.15)"}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}
              >
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: "var(--mf-text)" }}>
                    {name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
                {isReaction ? (
                  <span className="text-lg">{msg.reaction_emoji}</span>
                ) : (
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--mf-text-secondary)" }}>
                    {msg.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
