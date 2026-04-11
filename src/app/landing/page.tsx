import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppMockup } from "./app-mockup";
import { BlurReveal } from "./blur-reveal";
import { Marquee } from "./marquee";
import { InstallSection } from "./install-section";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "+Fortes — +Forte a cada dia",
  description: "Plataforma gratuita de acompanhamento com rede de apoio. Check-in diário, streak, conquistas — +forte a cada dia.",
};

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--mf-bg)" }}>

      {/* ═══════════════ NAV ═══════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: "color-mix(in srgb, var(--mf-bg) 80%, transparent)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: "var(--forest)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Fortes</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:inline-block px-5 py-2 rounded-full text-xs font-medium transition-all hover:opacity-70" style={{ color: "var(--mf-text-secondary)" }}>
              Entrar
            </Link>
            <Link href="/auth/register" className="px-5 py-2.5 rounded-full text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95" style={{ background: "var(--forest)" }}>
              Começar agora
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-dvh flex items-center overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, var(--forest) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, var(--coral) 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, var(--amber) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              {/* Eyebrow */}
              <BlurReveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px w-8" style={{ background: "var(--forest)" }} />
                  <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--forest)" }}>Mudança comportamental</span>
                </div>
              </BlurReveal>

              {/* Headline — mixed typography */}
              <BlurReveal delay={100}>
                <h1 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
                  <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight" style={{ color: "var(--mf-text)" }}>
                    <span style={{ background: "linear-gradient(135deg, var(--forest), var(--forest-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>+Forte</span>
                  </span>
                  <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mt-1" style={{ color: "var(--mf-text)" }}>
                    a cada dia.
                  </span>
                </h1>
              </BlurReveal>

              {/* Subtitle */}
              <BlurReveal delay={200}>
                <p className="text-lg sm:text-xl max-w-md leading-relaxed mb-10" style={{ color: "var(--mf-text-muted)" }}>
                  Registre como você está. Veja sua constância crescer. E se quiser, com quem te importa ao lado.
                </p>
              </BlurReveal>

              {/* CTA */}
              <BlurReveal delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Link
                    href="/auth/register"
                    className="group px-8 py-4 rounded-full text-white font-semibold text-sm inline-flex items-center gap-3 transition-all hover:gap-4 active:scale-[0.98]"
                    style={{ background: "var(--forest)", boxShadow: "0 0 0 0 rgba(45,106,79,0.3)", animation: "pulse-glow 3s ease-in-out infinite" }}
                  >
                    Comece sua jornada
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a href="#como-funciona" className="px-6 py-4 text-sm font-medium transition-all hover:opacity-70 inline-flex items-center gap-2" style={{ color: "var(--mf-text-secondary)" }}>
                    Como funciona
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--mf-border)" }}>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </a>
                </div>
              </BlurReveal>

              {/* Micro stats */}
              <BlurReveal delay={400}>
                <div className="flex items-center gap-8 mt-14 pt-8" style={{ borderTop: "1px solid var(--mf-border-subtle)" }}>
                  {[
                    { value: "10s", label: "por check-in" },
                    { value: "13", label: "conquistas" },
                    { value: "R$0", label: "para sempre" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <span className="text-2xl font-bold font-mono tracking-tight" style={{ color: "var(--forest)" }}>{stat.value}</span>
                      <span className="block text-[10px] font-mono uppercase tracking-wider mt-1" style={{ color: "var(--mf-text-muted)" }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </BlurReveal>
            </div>

            {/* Mockup */}
            <div className="lg:col-span-5 hidden lg:flex justify-center">
              <BlurReveal delay={300}>
                <AppMockup />
              </BlurReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <section className="py-6 border-y" style={{ borderColor: "var(--mf-border-subtle)" }}>
        <Marquee items={["Check-in diário", "Streak", "Conquistas", "Rede de apoio", "Privacidade total", "100% gratuito", "Open-source", "PWA", "Offline"]} />
      </section>

      {/* ═══════════════ PROBLEMA ═══════════════ */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="lg:sticky lg:top-32">
              <BlurReveal>
                <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--coral)" }}>O problema</span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                  Você já tentou<br />mudar sozinho.
                </h2>
                <p className="text-lg mt-4" style={{ color: "var(--mf-text-muted)" }}>
                  Sabe como é.
                </p>
              </BlurReveal>
            </div>
            <div className="space-y-4">
              {[
                { num: "01", text: "Começa motivado, mas em duas semanas já esqueceu" },
                { num: "02", text: "A vontade de desistir aparece mais que a de continuar" },
                { num: "03", text: "Quem te ama quer ajudar, mas não sabe o que fazer" },
                { num: "04", text: "Sem registro, parece que nada muda — mas muda" },
              ].map((item, i) => (
                <BlurReveal key={item.num} delay={i * 100}>
                  <div
                    className="group rounded-2xl p-6 transition-all hover:translate-x-1"
                    style={{ background: "var(--mf-bg-secondary)", border: "1px solid var(--mf-border-subtle)" }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono shrink-0 mt-0.5" style={{ color: "var(--coral)", opacity: 0.5 }}>{item.num}</span>
                      <p className="text-base" style={{ color: "var(--mf-text-secondary)" }}>{item.text}</p>
                    </div>
                  </div>
                </BlurReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BENTO GRID — FEATURES ═══════════════ */}
      <section className="py-32" style={{ background: "var(--mf-bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <BlurReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: "var(--forest)" }} />
              <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--forest)" }}>Como funciona</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 max-w-2xl leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Simples por design.<br />Poderoso por constância.
            </h2>
          </BlurReveal>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="como-funciona">
            {/* Card 1 — Check-in (large) */}
            <BlurReveal delay={0} className="md:col-span-2 lg:col-span-2">
              <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden group h-full" style={{ background: "var(--forest)", minHeight: "280px" }}>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 transition-transform group-hover:scale-110" style={{ background: "radial-gradient(circle, var(--forest-light), transparent)" }} />
                <div className="relative z-10">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">01 — Check-in</span>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-3 text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                    Como foi hoje?<br />Um toque. 10 segundos.
                  </h3>
                  <p className="text-sm text-white/60 mt-4 max-w-md">
                    Score de 1 a 5, nota opcional. Sem formulário, sem fricção. Registrar como você está já é o primeiro passo.
                  </p>
                  {/* Emoji row */}
                  <div className="flex gap-3 mt-8">
                    {["😔", "😕", "😐", "🙂", "😊"].map((e, i) => (
                      <div
                        key={e}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110"
                        style={{
                          background: i === 4 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                          border: i === 4 ? "2px solid rgba(255,255,255,0.4)" : "2px solid transparent",
                        }}
                      >
                        {e}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BlurReveal>

            {/* Card 2 — Streak */}
            <BlurReveal delay={100}>
              <div className="rounded-3xl p-8 relative overflow-hidden group h-full" style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)", minHeight: "280px" }}>
                <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--mf-text-muted)" }}>02 — Streak</span>
                <h3 className="text-xl font-bold mt-3 leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                  Cada dia<br />conta.
                </h3>
                <p className="text-sm mt-3" style={{ color: "var(--mf-text-muted)" }}>
                  Mantenha a sequência. Veja sua força crescer dia após dia.
                </p>
                {/* Streak visual */}
                <div className="flex items-end gap-1.5 mt-8">
                  {[3, 4, 3, 5, 4, 5, 5, 4, 5, 5, 4, 5].map((score, i) => (
                    <div
                      key={i}
                      className="w-full rounded-sm transition-all group-hover:opacity-100"
                      style={{
                        height: `${score * 12}px`,
                        background: `color-mix(in srgb, var(--forest) ${40 + i * 5}%, transparent)`,
                        opacity: 0.4 + i * 0.05,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-mono" style={{ color: "var(--forest)" }}>12</span>
                  <span className="text-xs" style={{ color: "var(--mf-text-muted)" }}>dias seguidos</span>
                </div>
              </div>
            </BlurReveal>

            {/* Card 3 — Rede de apoio */}
            <BlurReveal delay={150}>
              <div className="rounded-3xl p-8 relative overflow-hidden group h-full" style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)", minHeight: "280px" }}>
                <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--mf-text-muted)" }}>03 — Apoio</span>
                <h3 className="text-xl font-bold mt-3 leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                  Sua rede.<br />Se quiser.
                </h3>
                <p className="text-sm mt-3" style={{ color: "var(--mf-text-muted)" }}>
                  Convide família ou amigos. Eles acompanham, você controla quem vê o quê.
                </p>
                {/* Avatars stack */}
                <div className="flex items-center mt-8">
                  {["M", "J", "A", "L"].map((letter, i) => (
                    <div
                      key={letter}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 -ml-3 first:ml-0 transition-transform group-hover:translate-x-1"
                      style={{
                        background: `color-mix(in srgb, var(--forest) ${20 + i * 10}%, var(--mf-bg-secondary))`,
                        color: "var(--forest)",
                        borderColor: "var(--mf-bg)",
                        transitionDelay: `${i * 50}ms`,
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono -ml-3 border-2 border-dashed"
                    style={{ borderColor: "var(--mf-border)", color: "var(--mf-text-muted)", background: "var(--mf-bg)" }}
                  >
                    +
                  </div>
                </div>
                <p className="text-[10px] font-mono mt-3" style={{ color: "var(--mf-text-muted)" }}>100% opcional • max 5 por meta</p>
              </div>
            </BlurReveal>

            {/* Card 4 — Conquistas */}
            <BlurReveal delay={200} className="md:col-span-2 lg:col-span-2">
              <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden group h-full" style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)", minHeight: "200px" }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--amber)" }}>04 — Conquistas</span>
                    <h3 className="text-xl font-bold mt-3 leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                      De Bronze a Diamante.
                    </h3>
                    <p className="text-sm mt-3 max-w-sm" style={{ color: "var(--mf-text-muted)" }}>
                      13 conquistas para desbloquear. Cada marco merece ser celebrado.
                    </p>
                  </div>
                  {/* Achievement badges */}
                  <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                    {[
                      { emoji: "👣", label: "7d", color: "#CD7F32" },
                      { emoji: "🔥", label: "14d", color: "#A0A0A0" },
                      { emoji: "🛡️", label: "30d", color: "#FFB703" },
                      { emoji: "🏆", label: "90d", color: "#2D6A4F" },
                      { emoji: "💎", label: "365d", color: "#90E0EF" },
                    ].map((a, i) => (
                      <div
                        key={a.label}
                        className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
                        style={{
                          background: `color-mix(in srgb, ${a.color} 10%, var(--mf-bg-secondary))`,
                          border: `1px solid color-mix(in srgb, ${a.color} 25%, transparent)`,
                          transitionDelay: `${i * 50}ms`,
                        }}
                      >
                        <span className="text-lg">{a.emoji}</span>
                        <span className="text-[8px] font-mono" style={{ color: a.color }}>{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BlurReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRIVACIDADE + GRATUITO ═══════════════ */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BlurReveal>
              <div className="rounded-3xl p-10 h-full" style={{ background: "var(--mf-bg-secondary)", border: "1px solid var(--mf-border-subtle)" }}>
                <span className="text-4xl">🔒</span>
                <h3 className="text-2xl font-bold mt-4 mb-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                  Privacidade por padrão.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--mf-text-muted)" }}>
                  Você decide quem vê o quê. Por meta. Sem exceção. Nenhum dado é vendido, compartilhado ou usado para anúncio. Nunca.
                </p>
              </div>
            </BlurReveal>
            <BlurReveal delay={100}>
              <div className="rounded-3xl p-10 h-full" style={{ background: "var(--mf-bg-secondary)", border: "1px solid var(--mf-border-subtle)" }}>
                <span className="text-4xl">💚</span>
                <h3 className="text-2xl font-bold mt-4 mb-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                  Gratuito. Para sempre.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--mf-text-muted)" }}>
                  Sem plano pago, sem período de teste, sem pegadinha. Código aberto no GitHub. O propósito é ajudar — e pronto.
                </p>
              </div>
            </BlurReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ DEPOIMENTOS ═══════════════ */}
      <section className="py-32" style={{ background: "var(--mf-bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <BlurReveal>
            <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--mf-text-muted)" }}>Histórias</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-16 leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Quem usa, sente.
            </h2>
          </BlurReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { text: "Eu tentei parar de beber sozinho várias vezes. Quando minha irmã começou a acompanhar pelo app, tudo mudou.", who: "Protagonista", age: "34 anos" },
              { text: "Não sabia como ajudar meu irmão sem parecer que estava controlando. O +Fortes me deu um papel claro.", who: "Apoiadora", age: "28 anos" },
              { text: "O streak virou um jogo comigo mesmo. Quando vi que estava há 30 dias, chorei.", who: "Protagonista", age: "41 anos" },
            ].map((t, i) => (
              <BlurReveal key={i} delay={i * 100}>
                <div
                  className="rounded-3xl p-8 h-full flex flex-col justify-between transition-all hover:-translate-y-1"
                  style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)" }}
                >
                  <p className="text-base leading-relaxed mb-8" style={{ color: "var(--mf-text-secondary)" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>
                      {t.who[0]}
                    </div>
                    <div>
                      <span className="text-xs font-semibold block" style={{ color: "var(--mf-text)" }}>{t.who}</span>
                      <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>{t.age}</span>
                    </div>
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <BlurReveal>
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Perguntas<br />frequentes.
            </h2>
          </BlurReveal>
          <div className="space-y-0">
            {[
              { q: "É realmente grátis?", a: "Sim. Sem plano pago, sem anúncio, sem venda de dados. O código é aberto e o propósito é ajudar." },
              { q: "Preciso convidar alguém?", a: "Não. O app funciona completo sozinho. A rede de apoio está lá quando você quiser — sem pressa." },
              { q: "Meus dados são seguros?", a: "Sim. Criptografia, controle por meta e nada é público. Você decide tudo." },
              { q: "Funciona para qualquer mudança?", a: "Sim. Álcool, dieta, cigarro, celular, exercício — qualquer comportamento que você queira mudar." },
              { q: "Preciso baixar na App Store?", a: "Não. Acesse pelo navegador e instale direto na tela do celular — funciona como app." },
            ].map((faq, i) => (
              <BlurReveal key={i} delay={i * 60}>
                <div className="py-6" style={{ borderBottom: "1px solid var(--mf-border-subtle)" }}>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--mf-text)" }}>{faq.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--mf-text-muted)" }}>{faq.a}</p>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, var(--forest), transparent 70%)" }} />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <BlurReveal>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Sua mudança começa<br />com um <span style={{ whiteSpace: "nowrap" }}>check-in.</span>
            </h2>
          </BlurReveal>
          <BlurReveal delay={100}>
            <p className="text-lg mb-10" style={{ color: "var(--mf-text-muted)" }}>
              10 segundos por dia. Sem cobranças, sem julgamento.<br className="hidden sm:block" />
              E se quiser, com quem te importa ao lado.
            </p>
          </BlurReveal>
          <BlurReveal delay={200}>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-semibold transition-all hover:gap-4 active:scale-[0.98]"
              style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
            >
              Comece agora — é grátis
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </BlurReveal>
        </div>
      </section>

      {/* ═══════════════ INSTALL ═══════════════ */}
      <InstallSection />

      {/* ═══════════════ FOOTER ═══════════════ */}
      <Footer />
    </div>
  );
}
