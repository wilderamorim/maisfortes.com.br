"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download, Smartphone, Plus, SquareArrowUp, ArrowLeft,
  WifiOff, Bell, Gauge, Shield, Zap, Wifi,
  ChevronDown,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

type Platform = "android" | "ios" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

const STEPS_IOS = [
  { num: 1, icon: <SquareArrowUp className="w-5 h-5" />, title: "Abra no Safari", desc: "Acesse maisfortes.com.br pelo Safari. Outros navegadores não suportam instalação no iOS." },
  { num: 2, icon: <SquareArrowUp className="w-5 h-5" />, title: "Toque no botão Compartilhar", desc: "O ícone de compartilhar fica na barra inferior do Safari (quadrado com seta para cima)." },
  { num: 3, icon: <Plus className="w-5 h-5" />, title: 'Toque em "Adicionar à Tela Inicial"', desc: "Role para baixo no menu se não aparecer de imediato. O ícone é um + dentro de um quadrado." },
  { num: 4, icon: <Download className="w-5 h-5" />, title: 'Confirme tocando em "Adicionar"', desc: "O ícone do +Fortes aparecerá na sua tela inicial como qualquer outro app." },
];

const STEPS_ANDROID = [
  { num: 1, icon: <Download className="w-5 h-5" />, title: "Baixe na Google Play Store", desc: "Procure por \"+Fortes\" ou use o botão abaixo para ir direto à página do app." },
  { num: 2, icon: <Smartphone className="w-5 h-5" />, title: "Instale e abra", desc: "Toque em Instalar, aguarde o download e abra o app." },
  { num: 3, icon: <Plus className="w-5 h-5" />, title: "Faça login ou crie sua conta", desc: "Use seu email ou entre com Google. Leva menos de 30 segundos." },
  { num: 4, icon: <Zap className="w-5 h-5" />, title: "Pronto! Comece sua jornada", desc: "Defina sua primeira meta e faça seu primeiro check-in." },
];

const FEATURES = [
  { icon: <WifiOff className="w-5 h-5" />, title: "Funciona offline", desc: "Faça check-in mesmo sem internet. Sincroniza quando voltar online." },
  { icon: <Bell className="w-5 h-5" />, title: "Notificações push", desc: "Receba lembretes diários às 18h para não quebrar seu streak." },
  { icon: <Gauge className="w-5 h-5" />, title: "Leve e rápido", desc: "Menos de 1MB. Abre instantaneamente, sem ocupar espaço no celular." },
  { icon: <Shield className="w-5 h-5" />, title: "Privado e seguro", desc: "Seus dados ficam no seu perfil. Sem anúncios, sem venda de dados." },
  { icon: <Wifi className="w-5 h-5" />, title: "Sempre atualizado", desc: "Atualizações automáticas. Sem baixar novas versões na loja." },
  { icon: <Zap className="w-5 h-5" />, title: "100% gratuito", desc: "Sem planos pagos, sem trial, sem pegadinhas. Para sempre." },
];

const FAQ = [
  { q: "O +Fortes é um app nativo?", a: "No Android, o app está disponível na Play Store como TWA (Trusted Web Activity), que funciona como um app nativo. No iOS, é uma PWA (Progressive Web App) instalável pelo Safari." },
  { q: "Preciso de espaço no celular?", a: "Quase nenhum. O app ocupa menos de 1MB e roda direto do navegador. No Android via Play Store, o download é mínimo." },
  { q: "Funciona sem internet?", a: "Sim! Você pode fazer check-in offline. Os dados são sincronizados automaticamente quando a conexão voltar." },
  { q: "Vou receber notificações?", a: "Sim, se ativar. O app envia um lembrete diário às 18h para você fazer seu check-in. Você pode desativar a qualquer momento." },
  { q: "É realmente gratuito?", a: "Sim, 100%. O +Fortes foi criado para ajudar pessoas, não para gerar lucro. Sem anúncios, sem planos premium, sem dados vendidos." },
  { q: "Meus dados são seguros?", a: "Sim. Usamos Supabase (infraestrutura do Postgres) com criptografia em trânsito. Suas metas podem ser privadas — nem seus amigos veem o nome se você não quiser." },
];

export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [selected, setSelected] = useState<"android" | "ios">("android");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    if (p === "ios") setSelected("ios");
  }, []);

  const steps = selected === "ios" ? STEPS_IOS : STEPS_ANDROID;

  return (
    <div className="min-h-dvh" style={{ background: "var(--mf-bg)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 50%, #081C15 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute" style={{ width: 500, height: 500, top: -200, right: -100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
          <div className="absolute" style={{ width: 300, height: 300, bottom: -100, left: -50, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        </div>

        <div className="max-w-3xl mx-auto px-6 py-20 relative">
          <Link href="/landing" className="inline-flex items-center gap-1 text-xs mb-8 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.5)" }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                Baixar +Fortes
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Gratuito para Android e iOS
              </p>
            </div>
          </div>

          {/* Platform tabs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setSelected("android")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: selected === "android" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                color: selected === "android" ? "white" : "rgba(255,255,255,0.4)",
                border: `1px solid ${selected === "android" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.293a.5.5 0 0 0-.703.078l-1.484 1.82A7.48 7.48 0 0 0 12 3.5a7.48 7.48 0 0 0-3.336.691L7.18 2.371a.5.5 0 1 0-.781.625l1.406 1.723A7.5 7.5 0 0 0 4.5 10.5h15a7.5 7.5 0 0 0-3.305-5.781l1.406-1.723a.5.5 0 0 0-.078-.703zM9 8.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm6 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM4.5 11.5v7a2 2 0 0 0 2 2h1v2.5a1.5 1.5 0 0 0 3 0v-2.5h2v2.5a1.5 1.5 0 0 0 3 0v-2.5h1a2 2 0 0 0 2-2v-7h-14zM2 12a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm17 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z"/></svg>
              Android
            </button>
            <button
              onClick={() => setSelected("ios")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: selected === "ios" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                color: selected === "ios" ? "white" : "rgba(255,255,255,0.4)",
                border: `1px solid ${selected === "ios" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              iPhone / iPad
            </button>
          </div>

          {/* Play Store button (Android only) */}
          {selected === "android" && (
            <a
              href="https://play.google.com/store/apps/details?id=br.com.maisfortes.twa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "white" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" fill="#4285F4"/>
                <path d="M17.556 8.236l-3.764 3.764 3.764 3.764 4.252-2.42a1 1 0 0 0 0-1.744l-4.252-2.364z" fill="#FBBC04"/>
                <path d="M3.609 1.814L14.845 8.95l-1.053 1.053L3.609 1.814z" fill="#34A853"/>
                <path d="M3.609 22.186l10.183-8.19-1.053-1.052L3.61 22.186z" fill="#EA4335"/>
              </svg>
              <div>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: "#666" }}>Disponível no</p>
                <p className="text-sm font-bold" style={{ color: "#1A1A1A", marginTop: -1 }}>Google Play</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          {selected === "android" ? "Como instalar no Android" : "Como instalar no iPhone"}
        </h2>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex gap-4 rounded-2xl p-5"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold font-mono text-sm"
                style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}
              >
                {step.num}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--mf-text)" }}>{step.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--mf-text-muted)" }}>{step.desc}</p>
              </div>
              <div className="flex-shrink-0 hidden sm:block" style={{ color: "var(--mf-text-muted)" }}>{step.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Por que instalar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <div className="flex-shrink-0 mt-0.5" style={{ color: "var(--forest)" }}>{f.icon}</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>{f.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--mf-text-muted)" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Perguntas frequentes
        </h2>

        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left"
              >
                <span className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>{item.q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform"
                  style={{ color: "var(--mf-text-muted)", transform: openFaq === i ? "rotate(180deg)" : "none" }}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-xs leading-relaxed" style={{ color: "var(--mf-text-muted)" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center px-6 pb-20">
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
        >
          Criar conta gratuita
        </Link>
        <p className="text-xs mt-3" style={{ color: "var(--mf-text-muted)" }}>
          Sem cartão de crédito. Sem período de teste. Grátis para sempre.
        </p>
      </div>

      <Footer />
    </div>
  );
}
