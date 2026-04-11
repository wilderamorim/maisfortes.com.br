"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, Share, Plus, SquareArrowUp } from "lucide-react";

type Platform = "android" | "ios" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

const STEPS_IOS = [
  { icon: <SquareArrowUp className="w-5 h-5" />, text: "Toque no botão Compartilhar", detail: "Na barra inferior do Safari" },
  { icon: <Plus className="w-5 h-5" />, text: 'Toque em "Adicionar à Tela Inicial"', detail: "Role para baixo se necessário" },
  { icon: <Download className="w-5 h-5" />, text: 'Confirme tocando em "Adicionar"', detail: "O ícone aparecerá na sua tela" },
];

const STEPS_ANDROID = [
  { icon: <Download className="w-5 h-5" />, text: 'Toque em "Instalar app"', detail: "O banner aparece automaticamente" },
  { icon: <Smartphone className="w-5 h-5" />, text: "Confirme a instalação", detail: 'Toque em "Instalar" no popup' },
  { icon: <Plus className="w-5 h-5" />, text: "Pronto! Abra pela tela inicial", detail: "Funciona offline como app nativo" },
];

export function InstallSection() {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [selected, setSelected] = useState<"android" | "ios">("android");

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    if (p === "ios") setSelected("ios");
  }, []);

  const steps = selected === "ios" ? STEPS_IOS : STEPS_ANDROID;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, var(--forest) 0%, transparent 50%), radial-gradient(circle at 70% 50%, var(--forest) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Disponível para Android e iOS
          </div>

          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}
          >
            Instale o +Fortes
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--mf-text-muted)" }}>
            Sem loja, sem downloads pesados. Instale direto do navegador em segundos.
          </p>
        </div>

        {/* Platform tabs */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex rounded-xl p-1"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <button
              onClick={() => setSelected("android")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: selected === "android" ? "var(--forest)" : "transparent",
                color: selected === "android" ? "white" : "var(--mf-text-muted)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 2.293a.5.5 0 0 0-.703.078l-1.484 1.82A7.48 7.48 0 0 0 12 3.5a7.48 7.48 0 0 0-3.336.691L7.18 2.371a.5.5 0 1 0-.781.625l1.406 1.723A7.5 7.5 0 0 0 4.5 10.5h15a7.5 7.5 0 0 0-3.305-5.781l1.406-1.723a.5.5 0 0 0-.078-.703zM9 8.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm6 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM4.5 11.5v7a2 2 0 0 0 2 2h1v2.5a1.5 1.5 0 0 0 3 0v-2.5h2v2.5a1.5 1.5 0 0 0 3 0v-2.5h1a2 2 0 0 0 2-2v-7h-14zM2 12a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm17 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z"/>
              </svg>
              Android
            </button>
            <button
              onClick={() => setSelected("ios")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: selected === "ios" ? "var(--forest)" : "transparent",
                color: selected === "ios" ? "white" : "var(--mf-text-muted)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              iPhone / iPad
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-lg mx-auto">
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl p-5 transition-all"
                style={{
                  background: "var(--mf-surface)",
                  border: "1px solid var(--mf-border-subtle)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}
                >
                  <span className="font-bold font-mono text-sm" style={{ color: "var(--forest)" }}>{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>
                    {step.text}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--mf-text-muted)" }}>
                    {step.detail}
                  </p>
                </div>
                <div style={{ color: "var(--mf-text-muted)" }}>
                  {step.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
              {selected === "ios"
                ? "Funciona no Safari. Abra maisfortes.com.br no Safari para instalar."
                : "Funciona no Chrome, Edge, Samsung Internet e outros navegadores."}
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--forest)" }} />
                Funciona offline
              </div>
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--forest)" }} />
                Notificações push
              </div>
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--forest)" }} />
                Sem ocupar espaço
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
