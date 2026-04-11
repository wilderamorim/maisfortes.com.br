"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, Plus, SquareArrowUp } from "lucide-react";

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
  { icon: <Download className="w-5 h-5" />, text: "Baixe na Google Play Store", detail: "Instale como qualquer app" },
  { icon: <Smartphone className="w-5 h-5" />, text: "Abra e faça login", detail: "Use email ou Google" },
  { icon: <Plus className="w-5 h-5" />, text: "Pronto! Comece sua jornada", detail: "Notificações push e modo offline" },
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
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 50%, #081C15 100%)" }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute" style={{ width: 500, height: 500, top: -200, right: -100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute" style={{ width: 300, height: 300, bottom: -100, left: -50, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute" style={{ width: 200, height: 200, top: 100, left: "40%", borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text + Badges */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }}>
              <Smartphone className="w-3.5 h-3.5" />
              Disponível para Android e iOS
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
              Instale o<br />+Fortes
            </h2>

            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 380 }}>
              No Android, baixe direto pela Play Store. No iPhone, instale pelo Safari em segundos — sem ocupar espaço.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["Funciona offline", "Notificações push", "Leve e rápido", "100% gratuito"].map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
                  {f}
                </span>
              ))}
            </div>

            {/* Play Store button (Android) */}
            {selected === "android" && (
              <a
                href="https://play.google.com/store/apps/details?id=br.com.maisfortes.twa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" fill="#4285F4"/>
                  <path d="M17.556 8.236l-3.764 3.764 3.764 3.764 4.252-2.42a1 1 0 0 0 0-1.744l-4.252-2.364z" fill="#FBBC04"/>
                  <path d="M3.609 1.814L14.845 8.95l-1.053 1.053L3.609 1.814z" fill="#34A853"/>
                  <path d="M3.609 22.186l10.183-8.19-1.053-1.052L3.61 22.186z" fill="#EA4335"/>
                </svg>
                <div>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>Disponível no</p>
                  <p className="text-sm font-semibold text-white" style={{ marginTop: -1 }}>Google Play</p>
                </div>
              </a>
            )}
          </div>

          {/* Right: Steps card */}
          <div>
            {/* Platform tabs */}
            <div className="flex mb-6">
              <div className="inline-flex rounded-xl p-1" style={{ background: "rgba(255,255,255,0.08)" }}>
                <button
                  onClick={() => setSelected("android")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: selected === "android" ? "rgba(255,255,255,0.15)" : "transparent",
                    color: selected === "android" ? "white" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.293a.5.5 0 0 0-.703.078l-1.484 1.82A7.48 7.48 0 0 0 12 3.5a7.48 7.48 0 0 0-3.336.691L7.18 2.371a.5.5 0 1 0-.781.625l1.406 1.723A7.5 7.5 0 0 0 4.5 10.5h15a7.5 7.5 0 0 0-3.305-5.781l1.406-1.723a.5.5 0 0 0-.078-.703zM9 8.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm6 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM4.5 11.5v7a2 2 0 0 0 2 2h1v2.5a1.5 1.5 0 0 0 3 0v-2.5h2v2.5a1.5 1.5 0 0 0 3 0v-2.5h1a2 2 0 0 0 2-2v-7h-14zM2 12a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm17 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z"/></svg>
                  Android
                </button>
                <button
                  onClick={() => setSelected("ios")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: selected === "ios" ? "rgba(255,255,255,0.15)" : "transparent",
                    color: selected === "ios" ? "white" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  iPhone
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl p-5 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold font-mono text-sm"
                    style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{step.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{step.detail}</p>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)" }}>{step.icon}</div>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="text-[11px] mt-6 text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
              {selected === "ios"
                ? "Abra maisfortes.com.br no Safari para instalar."
                : "Também disponível como PWA direto pelo navegador."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
