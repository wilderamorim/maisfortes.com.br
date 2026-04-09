"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on auth or app pages
  const isAuthPage = pathname.startsWith("/auth/");
  const isAppPage = pathname.startsWith("/home") || pathname.startsWith("/checkin") || pathname.startsWith("/history") || pathname.startsWith("/network") || pathname.startsWith("/profile") || pathname.startsWith("/onboarding") || pathname.startsWith("/goals") || pathname.startsWith("/achievements");

  useEffect(() => {
    if (isAuthPage || isAppPage) return;
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show after 1 second
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-0"
      style={{ animation: "fade-up 0.4s ease-out" }}
    >
      <div
        className="max-w-lg mx-auto md:mb-6 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
            Cookies essenciais
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Usamos apenas cookies necessários para autenticação e preferências (tema).
            Sem rastreamento. Sem anúncios.{" "}
            <Link href="/privacidade" className="underline" style={{ color: "var(--forest)" }}>
              Saiba mais
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all active:scale-95"
            style={{ background: "var(--forest)" }}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
