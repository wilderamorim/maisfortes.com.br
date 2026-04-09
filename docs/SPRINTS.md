# +Fortes — Plano de Sprints & Tasks

> **Status:** Em andamento
> **Total de features:** 26
> **Total de tasks:** 98
> **Atualizado:** 2026-04-09

---

## Sprint 1 — Fundação (Setup, Auth, DB)

> Infraestrutura base: projeto Next.js, Supabase, auth, tema, layout mobile-first.

### Tasks

- [x] **1.1** Inicializar projeto Next.js 16 (App Router) com TypeScript
- [x] **1.2** Configurar Tailwind CSS v4 + design tokens da marca (+Fortes)
- [x] **1.3** Configurar Supabase (client, server, middleware, env vars)
- [x] **1.4** Criar schema do banco de dados (8 tabelas + indexes + trigger)
- [x] **1.5** Configurar Supabase RLS (Row Level Security) para todas as tabelas
- [x] **1.6** Seed de achievements (13 conquistas com nome, descrição, raridade, condição)
- [x] **1.7** Implementar autenticação (email/senha + Google OAuth) — **F1**
- [x] **1.8** Criar layout base mobile-first (bottom tab bar: Home, Histórico, +, Rede, Perfil)
- [x] **1.9** Implementar toggle de tema (light padrão / dark) com persistência — **F10 parcial**
- [x] **1.10** Configurar PWA manifest — **F22 parcial**
- [x] **1.11** Criar páginas placeholder para todas as tabs (Home, Histórico, Check-in, Rede, Perfil)
- [ ] **1.12** Configurar Sentry (error tracking) — adiado para Sprint 8

**Features cobertas:** F1, F10 (parcial), F22 (parcial)

---

## Sprint 2 — Core (Metas, Check-in, Streak, Histórico)

> Funcionalidades centrais que o protagonista usa sozinho.

### Tasks

- [x] **2.1** Criar página/fluxo "Nova Meta" (título + descrição) — **F2**
- [x] **2.2** Listar metas ativas na Home (cards com streak, última atividade)
- [x] **2.3** Suportar múltiplas metas simultâneas com ordenação — **F2**
- [ ] **2.4** Pausar / reativar / completar meta
- [x] **2.5** Criar componente Score Selector (1-5 com emojis de humor)
- [x] **2.6** Implementar fluxo de check-in diário (selecionar meta → score → nota opcional → confirmar) — **F3**
- [x] **2.7** Validar regra RN-03: apenas 1 check-in por dia por meta, editável até meia-noite
- [x] **2.8** Calcular e atualizar streak automaticamente após check-in — **F4**
- [x] **2.9** Validar regra RN-04: streak quebra se pular 1 dia completo
- [x] **2.10** Atualizar best_streak quando superar recorde
- [x] **2.11** Criar página Histórico com timeline de check-ins por meta — **F9**
- [x] **2.12** Criar timeline de check-ins com filtro por meta — **F9**
- [ ] **2.13** Criar gráfico de score semanal (bar chart simples)
- [ ] **2.14** Criar gráfico de distribuição de humor (mood breakdown)
- [x] **2.15** Implementar haptic feedback no score selector e confirmação de check-in — **F24**

**Features cobertas:** F2, F3, F4, F9, F24

---

## Sprint 3 — Social (Apoiadores, Mensagens, Reações)

> Rede de apoio: convidar, acompanhar, interagir.

### Tasks

- [ ] **3.1** Gerar invite_code único por convite de apoiador — **F19**
- [ ] **3.2** Criar página de convite público (link compartilhável) — **F19**
- [ ] **3.3** Gerar QR code do link de convite — **F19**
- [ ] **3.4** Implementar fluxo de convite: protagonista seleciona meta → gera link → compartilha — **F5**
- [ ] **3.5** Implementar aceitação de convite (criar conta se necessário) — **F5**
- [ ] **3.6** Validar RN-06: máximo 5 apoiadores por meta
- [ ] **3.7** Validar RN-09: convite é 100% opcional (app funciona solo)
- [ ] **3.8** Implementar privacidade granular: apoiador vê Meta A mas não Meta B — **F25**
- [ ] **3.9** Configuração por apoiador: pode ver score (sim/não), pode ver notas (sim/não) — **F25**
- [ ] **3.10** Criar dashboard do apoiador com feed de atividade — **F6, F20**
- [ ] **3.11** Feed mostra: check-in feito, conquista desbloqueada, streak milestone — **F20**
- [ ] **3.12** Implementar envio de mensagem de incentivo (max 500 chars) — **F8**
- [ ] **3.13** Implementar reação rápida (coração, força, palma, abraço) — **F21**
- [ ] **3.14** Mostrar mensagens/reações para o protagonista na Home
- [ ] **3.15** Marcar mensagens como lidas (read_at)
- [ ] **3.16** Protagonista pode remover apoiador a qualquer momento (RN-07)

**Features cobertas:** F5, F6, F8, F19, F20, F21, F25

---

## Sprint 4 — Gamificação (Conquistas, Milestones, Streak de Amigos)

> Sistema de achievements, celebrações visuais e streak social.

### Tasks

- [ ] **4.1** Implementar engine de conquistas: verificar condições após cada check-in — **F13**
- [ ] **4.2** Desbloquear conquistas de streak (7, 14, 30, 60, 90, 180, 365 dias) — **F13**
- [ ] **4.3** Desbloquear conquistas sociais (primeiro apoiador, 3+ apoiadores, 10 mensagens) — **F13**
- [ ] **4.4** Desbloquear conquistas especiais (multi-jornada, volta por cima, constância) — **F13**
- [ ] **4.5** Criar página de conquistas no perfil (grid com badges, raridade, data de desbloqueio) — **F13**
- [ ] **4.6** Conquistas bloqueadas mostram silhueta + condição para desbloquear
- [ ] **4.7** Notificação in-app ao desbloquear conquista (toast + animação)
- [ ] **4.8** Criar animação de celebração para milestones (7, 30, 90, 365 dias) — **F18**
- [ ] **4.9** Implementar confetti/particles na celebração
- [ ] **4.10** Implementar sistema de amizade (adicionar amigo por link) — **F12**
- [ ] **4.11** Criar mural de streak de amigos (streak lado a lado, sem ranking) — **F12**
- [ ] **4.12** Validar RN-12: amigo só vê dias de streak, nunca scores/notas
- [ ] **4.13** Nudge gentil: se amigo quebra streak, sugerir mandar mensagem — **F12**

**Features cobertas:** F12, F13, F18

---

## Sprint 5 — Engajamento (Onboarding, Push, Resumo, Dia Difícil)

> Retenção: primeiro uso, lembretes, suporte emocional.

### Tasks

- [ ] **5.1** Criar fluxo de onboarding guiado (4 passos) — **F15**
- [ ] **5.2** Passo 1: "Qual é sua primeira meta?"
- [ ] **5.3** Passo 2: "Quer convidar alguém?" com botão "Pular" visível — **F15**
- [ ] **5.4** Passo 3: "Como está se sentindo hoje?" (primeiro check-in)
- [ ] **5.5** Animação de conquista "Primeiro Passo" ao final do onboarding
- [ ] **5.6** Marcar onboarding_completed no perfil
- [ ] **5.7** Implementar Web Push API (pedir permissão, salvar subscription) — **F16**
- [ ] **5.8** Criar Supabase Edge Function para enviar push diário — **F16**
- [ ] **5.9** Push de lembrete: "Ei, como foi hoje?" (configurável horário)
- [ ] **5.10** Push de alerta para apoiadores: inatividade 48h — **F7**
- [ ] **5.11** Criar resumo semanal (cron todo domingo) — **F17**
- [ ] **5.12** Conteúdo do resumo: check-ins da semana, score médio, streak atual, conquistas
- [ ] **5.13** Exibir resumo como card na Home todo domingo/segunda
- [ ] **5.14** Implementar modo "dia difícil" — **F26**
- [ ] **5.15** Score 1 → tela especial: "Quer falar com alguém da sua rede?" + opção de enviar alerta
- [ ] **5.16** Configuração de notificações no perfil (horário do lembrete, ativar/desativar)

**Features cobertas:** F7, F15, F16, F17, F26

---

## Sprint 6 — Perfil & Configurações

> Tela de perfil completa, configurações, dados pessoais.

### Tasks

- [ ] **6.1** Criar página de perfil (avatar, nome, email, data de entrada) — **F10**
- [ ] **6.2** Upload de avatar (Supabase Storage)
- [ ] **6.3** Editar nome
- [ ] **6.4** Toggle de tema light/dark no perfil — **F10**
- [ ] **6.5** Seção de conquistas no perfil (resumo + link para página completa)
- [ ] **6.6** Seção de estatísticas (total check-ins, melhor streak, metas ativas)
- [ ] **6.7** Configurações de privacidade (gerenciar apoiadores por meta)
- [ ] **6.8** Configurações de notificações
- [ ] **6.9** Exportar meus dados (JSON)
- [ ] **6.10** Excluir conta (com confirmação)

**Features cobertas:** F10

---

## Sprint 7 — Landing Page

> Página pública de conversão com mockup HTML animado do app.

### Tasks

- [ ] **7.1** Criar layout da landing page (SSR, sem autenticação) — **F14**
- [ ] **7.2** Hero section: headline + subtítulo + CTA "Comece sua jornada"
- [ ] **7.3** Mockup HTML animado do app no hero (dashboard com check-in, streak, rede) — **F14**
- [ ] **7.4** Elementos de animação: glow orbs (radial gradient + pulse) — **F14**
- [ ] **7.5** Elementos de animação: floating bubbles / particles
- [ ] **7.6** Seção "O problema" com scroll reveal (fade-up)
- [ ] **7.7** Seção "A solução" com 3 pilares (autogestão, apoio social, accountability)
- [ ] **7.8** Seção "Como funciona" (4 passos visuais com ícones SVG)
- [ ] **7.9** Seção "Features" com grid de cards + ícones Lucide
- [ ] **7.10** Seção "Conquistas" preview (badges visuais)
- [ ] **7.11** Seção CTA final ("Ninguém muda sozinho. Comece agora — é grátis.")
- [ ] **7.12** Implementar motion on scroll (Intersection Observer + CSS transitions)
- [ ] **7.13** Implementar animated counters (streak, dias, usuários)
- [ ] **7.14** CTA fixo no mobile (bottom sticky bar)
- [ ] **7.15** Grain overlay sutil
- [ ] **7.16** Responsivo: mockup visível no desktop, stats no mobile
- [ ] **7.17** SEO: meta tags, OG tags, structured data

**Features cobertas:** F14

---

## Sprint 8 — PWA & Polish

> Offline, performance, polimento final.

### Tasks

- [ ] **8.1** Service worker completo: cache de assets estáticos — **F22**
- [ ] **8.2** PWA manifest: ícones, splash screen, cores da marca — **F22**
- [ ] **8.3** Implementar offline check-in: salvar em IndexedDB — **F23**
- [ ] **8.4** Sync de check-ins offline quando voltar online — **F23**
- [ ] **8.5** Indicador visual "offline" + "sincronizando..."
- [ ] **8.6** Testar instalação PWA (Android Chrome, iOS Safari)
- [ ] **8.7** Performance audit: Lighthouse score 90+ em mobile
- [ ] **8.8** Otimizar bundle: code splitting, lazy loading de rotas
- [ ] **8.9** Testar todos os fluxos E2E (onboarding, check-in, convite, conquistas)
- [ ] **8.10** Testar responsividade em 5 dispositivos (iPhone SE, iPhone 15, Pixel, Galaxy, iPad)
- [ ] **8.11** Testar dark mode em todas as telas
- [ ] **8.12** Revisar acessibilidade: contrast ratios, focus states, screen reader
- [ ] **8.13** Deploy final no Vercel + configurar domínio maisfortes.com.br

**Features cobertas:** F22, F23

---

## Mapa de Features → Tasks

| Feature | Sprint | Tasks |
|---------|--------|-------|
| F1 — Auth | 1 | 1.7 |
| F2 — Múltiplas Metas | 2 | 2.1, 2.2, 2.3, 2.4 |
| F3 — Check-in Diário | 2 | 2.5, 2.6, 2.7 |
| F4 — Streak | 2 | 2.8, 2.9, 2.10 |
| F5 — Convidar Apoiador | 3 | 3.4, 3.5, 3.6, 3.7 |
| F6 — Dashboard Apoiador | 3 | 3.10 |
| F7 — Alerta Inatividade | 5 | 5.10 |
| F8 — Mensagem Incentivo | 3 | 3.12 |
| F9 — Histórico | 2 | 2.11, 2.12, 2.13, 2.14 |
| F10 — Perfil | 1+6 | 1.9, 6.1-6.10 |
| F12 — Streak Amigos | 4 | 4.10, 4.11, 4.12, 4.13 |
| F13 — Conquistas | 4 | 4.1-4.7 |
| F14 — Landing Page | 7 | 7.1-7.17 |
| F15 — Onboarding | 5 | 5.1-5.6 |
| F16 — Push Notifications | 5 | 5.7-5.9 |
| F17 — Resumo Semanal | 5 | 5.11-5.13 |
| F18 — Celebração Milestone | 4 | 4.8, 4.9 |
| F19 — Convite Link/QR | 3 | 3.1, 3.2, 3.3 |
| F20 — Feed Atividade | 3 | 3.10, 3.11 |
| F21 — Reação Rápida | 3 | 3.13 |
| F22 — PWA | 1+8 | 1.10, 8.1, 8.2 |
| F23 — Offline Check-in | 8 | 8.3, 8.4, 8.5 |
| F24 — Haptic Feedback | 2 | 2.15 |
| F25 — Privacidade Granular | 3 | 3.8, 3.9 |
| F26 — Modo Dia Difícil | 5 | 5.14, 5.15 |

---

## Progresso

| Sprint | Tasks | Concluídas | % |
|--------|-------|------------|---|
| 1 — Fundação | 12 | 11 | 92% |
| 2 — Core | 15 | 12 | 80% |
| 3 — Social | 16 | 0 | 0% |
| 4 — Gamificação | 13 | 0 | 0% |
| 5 — Engajamento | 16 | 0 | 0% |
| 6 — Perfil | 10 | 0 | 0% |
| 7 — Landing Page | 17 | 0 | 0% |
| 8 — PWA & Polish | 13 | 0 | 0% |
| **Total** | **98** | **23** | **23%** |

---

*Plano criado por Orion (AIOX Master) — 2026-04-09*
