import Link from "next/link";
import { Flame, Users, Shield, Bell, Trophy, CheckCircle, ArrowRight, Heart, Zap, Lock, Star, MessageCircle, Target } from "lucide-react";
import { AppMockup } from "./app-mockup";
import { ScrollReveal } from "./scroll-reveal";
import { AnimatedCounter } from "./animated-counter";

export const metadata = {
  title: "+Fortes — Juntos, somos mais fortes",
  description: "Plataforma gratuita de acompanhamento com rede de apoio. Check-in diário, streak, conquistas — ninguém muda sozinho.",
};

const features = [
  { icon: CheckCircle, title: "Check-in diário", desc: "Registre como foi seu dia em 10 segundos. Score de 1 a 5 + nota opcional." },
  { icon: Flame, title: "Streak", desc: "Acompanhe sua sequência de dias. Consistência importa mais que perfeição." },
  { icon: Users, title: "Rede de apoio", desc: "Convide quem te apoia — opcional, privado, sem julgamento." },
  { icon: Bell, title: "Alertas inteligentes", desc: "Sua rede recebe alerta se você precisar de apoio. Sem ser invasivo." },
  { icon: Shield, title: "Privacidade granular", desc: "Controle por meta quem vê o quê. Seus dados, suas regras." },
  { icon: Trophy, title: "Conquistas", desc: "Desbloqueie troféus de Bronze a Diamante à medida que evolui." },
];

const steps = [
  { num: "01", title: "Crie sua meta", desc: "Defina o que quer mudar — dieta, vício, hábito. Pode ter várias." },
  { num: "02", title: "Faça check-in diário", desc: "Score de 1 a 5 + nota opcional. Leva 10 segundos. Todo dia conta." },
  { num: "03", title: "Convide quem te apoia", desc: "Família, amigos — opcional, por link. Eles acompanham sem invadir." },
  { num: "04", title: "Evolua acompanhado", desc: "Streak, conquistas e sua rede torcendo por você. Um dia de cada vez." },
];

const achievements = [
  { name: "Primeiro Passo", rarity: "bronze", color: "#CD7F32" },
  { name: "Semana Firme", rarity: "bronze", color: "#CD7F32" },
  { name: "Quinzena", rarity: "prata", color: "#A0A0A0" },
  { name: "Mês de Ferro", rarity: "ouro", color: "#FFB703" },
  { name: "Trimestre", rarity: "platina", color: "#2D6A4F" },
  { name: "Um Ano", rarity: "diamante", color: "#90E0EF" },
];

const comparisons = [
  { them: "Apps de hábitos", us: "+Fortes", diff: "Foco individual → Rede de apoio estruturada" },
  { them: "Grupos de WhatsApp", us: "+Fortes", diff: "Sem estrutura → Check-in diário + streak + dados" },
  { them: "Apps de recovery", us: "+Fortes", diff: "Comunidade anônima → Pessoas que você escolhe" },
];

const testimonials = [
  { text: "Eu tentei parar de beber sozinho várias vezes. Quando minha irmã começou a acompanhar pelo app, tudo mudou.", author: "Protagonista, 34 anos" },
  { text: "Não sabia como ajudar meu irmão sem parecer que estava controlando. O +Fortes me deu um papel claro.", author: "Apoiadora, 28 anos" },
  { text: "O streak virou um jogo comigo mesmo. Quando vi que estava há 30 dias, chorei.", author: "Protagonista, 41 anos" },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--mf-bg)" }}>

      {/* ═══════════════ NAV ═══════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--mf-bg) 85%, transparent)", borderBottom: "1px solid var(--mf-border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--forest)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
            <span className="font-bold text-sm" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Fortes</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:inline-block px-4 py-2 rounded-lg text-xs font-semibold transition-all" style={{ color: "var(--mf-text-secondary)" }}>
              Entrar
            </Link>
            <Link href="/auth/register" className="px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all active:scale-95" style={{ background: "var(--forest)" }}>
              Começar
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-60" style={{ background: "radial-gradient(ellipse, rgba(45,106,79,0.08) 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[200px] rounded-full opacity-40" style={{ background: "radial-gradient(ellipse, rgba(244,132,95,0.06) 0%, transparent 70%)", animation: "float 10s ease-in-out 2s infinite" }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, var(--mf-text-muted) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-6" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>
                100% gratuito e open-source
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Ninguém muda{" "}
                <span style={{ background: "linear-gradient(90deg, var(--forest), var(--forest-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  sozinho
                </span>
              </h1>
              <p className="text-lg mb-8 max-w-lg" style={{ color: "var(--mf-text-secondary)" }}>
                +Fortes conecta quem está mudando um comportamento com quem apoia. Check-in diário, streak, conquistas e rede de apoio privada.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/register" className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98]" style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}>
                  Comece sua jornada <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#como-funciona" className="px-8 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center transition-all" style={{ border: "1px solid var(--mf-border)", color: "var(--mf-text-secondary)" }}>
                  Como funciona
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <AppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS TICKER ═══════════════ */}
      <section className="py-6 border-y" style={{ borderColor: "var(--mf-border-subtle)", background: "var(--mf-bg)" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <ScrollReveal>
              <div>
                <AnimatedCounter target={13} suffix="" />
                <p className="text-xs mt-1" style={{ color: "var(--mf-text-muted)" }}>conquistas para desbloquear</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div>
                <AnimatedCounter target={26} suffix="" />
                <p className="text-xs mt-1" style={{ color: "var(--mf-text-muted)" }}>features no MVP</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <AnimatedCounter target={0} prefix="R$" suffix="" />
                <p className="text-xs mt-1" style={{ color: "var(--mf-text-muted)" }}>para sempre</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ PROBLEMA ═══════════════ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--coral)" }}>O problema</span>
              <h2 className="text-3xl font-bold mt-3 mb-4" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Mudar sozinho é mais difícil do que parece
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Target, text: "Falta de acompanhamento constante" },
              { icon: Heart, text: "Isolamento emocional na jornada" },
              { icon: Zap, text: "Dificuldade em manter disciplina" },
              { icon: Users, text: "Família quer ajudar mas não sabe como" },
            ].map((item, i) => (
              <ScrollReveal key={item.text} delay={i * 100}>
                <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: "var(--mf-bg-secondary)", border: "1px solid var(--mf-border-subtle)" }}>
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "rgba(244,132,95,0.1)" }}>
                    <item.icon className="w-4 h-4" style={{ color: "var(--coral)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--mf-text-secondary)" }}>{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SOLUÇÃO (3 PILARES) ═══════════════ */}
      <section className="py-20" style={{ background: "var(--mf-bg-secondary)" }}>
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--forest)" }}>A solução</span>
              <h2 className="text-3xl font-bold mt-3 mb-4" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Três pilares em um único lugar
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle, title: "Autogestão", desc: "Check-in diário, streak, histórico. Você no controle da sua evolução.", color: "var(--forest)" },
              { icon: Users, title: "Apoio social", desc: "Rede de apoio estruturada. Família e amigos com papel claro — sem invadir.", color: "var(--coral)" },
              { icon: Trophy, title: "Gamificação", desc: "Conquistas, milestones e streak de amigos. Motivação que funciona.", color: "var(--amber)" },
            ].map((pillar, i) => (
              <ScrollReveal key={pillar.title} delay={i * 150}>
                <div className="rounded-2xl p-8 text-center h-full" style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)" }}>
                  <div className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center" style={{ background: `color-mix(in srgb, ${pillar.color} 10%, transparent)` }}>
                    <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>{pillar.title}</h3>
                  <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>{pillar.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES GRID ═══════════════ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--mf-text-muted)" }}>Features</span>
              <h2 className="text-3xl font-bold mt-3 mb-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Tudo que você precisa
              </h2>
              <p style={{ color: "var(--mf-text-muted)" }}>Simples, privado e gratuito.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className="rounded-xl p-6 transition-all hover:shadow-md group" style={{ background: "var(--mf-bg-secondary)", border: "1px solid var(--mf-border-subtle)" }}>
                  <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: "rgba(45,106,79,0.1)" }}>
                    <f.icon className="w-5 h-5" style={{ color: "var(--forest)" }} />
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: "var(--mf-text)" }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMO FUNCIONA ═══════════════ */}
      <section id="como-funciona" className="py-20" style={{ background: "var(--mf-bg-secondary)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--mf-text-muted)" }}>Passo a passo</span>
              <h2 className="text-3xl font-bold mt-3 mb-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Como funciona
              </h2>
              <p style={{ color: "var(--mf-text-muted)" }}>4 passos. 30 segundos.</p>
            </div>
          </ScrollReveal>
          <div className="space-y-1">
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 120}>
                <div className="flex gap-5 items-start rounded-xl p-5 transition-all" style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)" }}>
                  <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-mono font-bold text-lg" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>
                    {s.num}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--mf-text)" }}>{s.title}</h3>
                    <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CONQUISTAS PREVIEW ═══════════════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--amber)" }}>Gamificação</span>
              <h2 className="text-3xl font-bold mt-3 mb-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Conquistas que motivam
              </h2>
              <p style={{ color: "var(--mf-text-muted)" }}>De Bronze a Diamante. Cada marco merece ser celebrado.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {achievements.map((a, i) => (
              <ScrollReveal key={a.name} delay={i * 80}>
                <div className="rounded-xl p-4 text-center" style={{ background: `color-mix(in srgb, ${a.color} 8%, var(--mf-bg-secondary))`, border: `1px solid color-mix(in srgb, ${a.color} 20%, transparent)` }}>
                  <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: `color-mix(in srgb, ${a.color} 15%, transparent)` }}>
                    <Star className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <p className="text-[10px] font-semibold" style={{ color: "var(--mf-text)" }}>{a.name}</p>
                  <p className="text-[8px] font-mono uppercase" style={{ color: a.color }}>{a.rarity}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPARAÇÃO ═══════════════ */}
      <section className="py-20" style={{ background: "var(--mf-bg-secondary)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--mf-text-muted)" }}>Por que +Fortes?</span>
              <h2 className="text-3xl font-bold mt-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Diferente de tudo que existe
              </h2>
            </div>
          </ScrollReveal>
          <div className="space-y-3">
            {comparisons.map((c, i) => (
              <ScrollReveal key={c.them} delay={i * 100}>
                <div className="rounded-xl p-5" style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(244,132,95,0.1)", color: "var(--coral)" }}>{c.them}</span>
                    <ArrowRight className="w-3 h-3" style={{ color: "var(--mf-text-muted)" }} />
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>{c.us}</span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--mf-text-secondary)" }}>{c.diff}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DEPOIMENTOS ═══════════════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--mf-text-muted)" }}>Depoimentos</span>
              <h2 className="text-3xl font-bold mt-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Histórias reais
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="rounded-xl p-6 h-full flex flex-col" style={{ background: "var(--mf-bg-secondary)", border: "1px solid var(--mf-border-subtle)" }}>
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" style={{ color: "var(--amber)" }} />
                    ))}
                  </div>
                  <p className="text-sm flex-1 mb-4" style={{ color: "var(--mf-text-secondary)" }}>"{t.text}"</p>
                  <p className="text-xs font-mono" style={{ color: "var(--mf-text-muted)" }}>— {t.author}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-20" style={{ background: "var(--mf-bg-secondary)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
                Perguntas frequentes
              </h2>
            </div>
          </ScrollReveal>
          <div className="space-y-3">
            {[
              { q: "É realmente grátis?", a: "Sim, 100%. Sem planos pagos, sem anúncios, sem venda de dados. É um projeto open-source." },
              { q: "Preciso convidar alguém?", a: "Não. O app funciona perfeitamente sozinho. A rede de apoio é opcional — convide quando e se quiser." },
              { q: "Meus dados são seguros?", a: "Sim. Usamos criptografia, controle de acesso por linha no banco e você controla quem vê o quê. Nada é público." },
              { q: "Funciona para qualquer tipo de mudança?", a: "Sim. Vício, dieta, exercício, hábito digital, saúde mental — qualquer comportamento que você queira mudar." },
              { q: "Preciso baixar na App Store?", a: "Não. É um Progressive Web App (PWA). Acesse pelo navegador e instale direto na tela do seu celular." },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="rounded-xl p-5" style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)" }}>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--mf-text)" }}>{faq.q}</h3>
                  <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>{faq.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-40" style={{ background: "radial-gradient(ellipse, rgba(45,106,79,0.1), transparent 70%)" }} />
        </div>
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Ninguém muda sozinho.
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--mf-text-muted)" }}>
              Comece sua jornada e convide quem te apoia. É grátis, sempre.
            </p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all active:scale-[0.98]" style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}>
              Comece agora — é grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs mt-4" style={{ color: "var(--mf-text-muted)" }}>
              Sem cartão de crédito. Sem período de teste. Grátis de verdade.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="py-10 border-t" style={{ borderColor: "var(--mf-border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--forest)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
                <span className="font-bold text-sm" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Fortes</span>
              </div>
              <p className="text-xs max-w-xs" style={{ color: "var(--mf-text-muted)" }}>
                Plataforma gratuita de acompanhamento com rede de apoio para mudança comportamental.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <h4 className="text-xs font-semibold mb-3" style={{ color: "var(--mf-text)" }}>Produto</h4>
                <div className="space-y-2">
                  <a href="#como-funciona" className="text-xs block" style={{ color: "var(--mf-text-muted)" }}>Como funciona</a>
                  <Link href="/auth/register" className="text-xs block" style={{ color: "var(--mf-text-muted)" }}>Criar conta</Link>
                  <a href="https://brand.maisfortes.com.br" target="_blank" rel="noopener" className="text-xs block" style={{ color: "var(--mf-text-muted)" }}>Brandbook</a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold mb-3" style={{ color: "var(--mf-text)" }}>Legal</h4>
                <div className="space-y-2">
                  <Link href="/termos" className="text-xs block" style={{ color: "var(--mf-text-muted)" }}>Termos de uso</Link>
                  <Link href="/privacidade" className="text-xs block" style={{ color: "var(--mf-text-muted)" }}>Política de privacidade</Link>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold mb-3" style={{ color: "var(--mf-text)" }}>Open-source</h4>
                <div className="space-y-2">
                  <a href="https://github.com/wilderamorim/maisfortes.com.br" target="_blank" rel="noopener" className="text-xs block" style={{ color: "var(--mf-text-muted)" }}>GitHub</a>
                  <a href="https://github.com/wilderamorim/maisfortes.com.br/blob/main/LICENSE" target="_blank" rel="noopener" className="text-xs block" style={{ color: "var(--mf-text-muted)" }}>Licença MIT</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: "var(--mf-border-subtle)" }}>
            <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>+Fortes — Juntos, somos mais fortes.</span>
            <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
