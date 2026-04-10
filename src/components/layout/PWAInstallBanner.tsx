"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Smartphone, Download, Share2, Plus, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const pathname = usePathname();

  // Only show on app pages (not landing/auth)
  const isAppPage = pathname.startsWith("/home") || pathname.startsWith("/checkin") ||
    pathname.startsWith("/history") || pathname.startsWith("/network") ||
    pathname.startsWith("/profile") || pathname.startsWith("/goals") ||
    pathname.startsWith("/achievements") || pathname.startsWith("/onboarding");

  useEffect(() => {
    if (!isAppPage) return;

    // Already installed as PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Already dismissed this session
    if (sessionStorage.getItem("mf_pwa_dismissed")) return;

    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    if (ios) {
      // iOS: show after 4s
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }

    // Android/Desktop: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isAppPage]);

  function handleDismiss() {
    setVisible(false);
    setShowIOSGuide(false);
    sessionStorage.setItem("mf_pwa_dismissed", "1");
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    }
  }

  if (!visible || !isAppPage) return null;

  return (
    <>
      {/* Banner */}
      <div
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[90]"
        style={{ animation: "slide-up 0.4s ease-out" }}
      >
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--mf-surface)",
            border: "1px solid var(--mf-border)",
            boxShadow: "var(--mf-shadow-lg)",
          }}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(45,106,79,0.1)" }}
            >
              <Smartphone className="w-5 h-5" style={{ color: "var(--forest)" }} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm" style={{ color: "var(--mf-text)" }}>
                Instale o +Fortes
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--mf-text-muted)" }}>
                Acesse mais rápido direto da tela inicial do seu celular.
              </p>
            </div>

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 rounded-lg transition-colors"
              style={{ color: "var(--mf-text-muted)" }}
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            {isIOS ? (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex-1 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
              >
                Como instalar
              </button>
            ) : (
              <button
                onClick={handleInstall}
                className="flex-1 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
              >
                <Download className="w-3.5 h-3.5" /> Instalar
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{ color: "var(--mf-text-muted)" }}
            >
              Agora não
            </button>
          </div>
        </div>
      </div>

      {/* iOS Guide Overlay */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4" onClick={handleDismiss}>
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 mb-4"
            style={{
              background: "var(--mf-surface)",
              border: "1px solid var(--mf-border)",
              animation: "slide-up 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-5" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Como instalar no iPhone/iPad
            </h3>

            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(45,106,79,0.1)" }}
                >
                  <Share2 className="w-5 h-5" style={{ color: "var(--forest)" }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                    Toque no botão <strong>Compartilhar</strong> do Safari
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--mf-text-muted)" }}>
                    É o ícone de quadrado com seta para cima na barra inferior
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(45,106,79,0.1)" }}
                >
                  <Plus className="w-5 h-5" style={{ color: "var(--forest)" }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                    Selecione <strong>"Adicionar à Tela de Início"</strong>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--mf-text-muted)" }}>
                    Role as opções para encontrar
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(45,106,79,0.1)" }}
                >
                  <Download className="w-5 h-5" style={{ color: "var(--forest)" }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                    Toque em <strong>"Adicionar"</strong>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--mf-text-muted)" }}>
                    O +Fortes aparecerá na sua tela inicial como um app
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold mt-6 transition-all active:scale-[0.98]"
              style={{ background: "var(--forest)" }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
