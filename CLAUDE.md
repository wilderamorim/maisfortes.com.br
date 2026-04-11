# +Fortes — maisfortes.com.br

Plataforma gratuita de acompanhamento com rede de apoio para mudança comportamental.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** com `@theme inline` e CSS custom properties (`--mf-*`)
- **Supabase** (Auth, Postgres, RLS, Storage, Edge Functions)
- **Vitest** + **Testing Library** + **happy-dom** (testes)
- **Lucide React** (ícones)
- PWA com Service Worker e Web Push

## Estrutura

```
src/
├── app/
│   ├── (app)/              # Rotas autenticadas (bottom tab bar)
│   │   ├── home/           # Dashboard com metas, streaks, resumo semanal
│   │   ├── checkin/        # Check-in diário (score 1-5) + goal picker inteligente
│   │   ├── history/        # Histórico com heatmap, score chart, mood distribution
│   │   ├── network/        # Rede de apoio + ofensiva de amigos (Duolingo-like)
│   │   ├── profile/        # Perfil, stats, conquistas, tema, avatar upload
│   │   ├── goals/          # Criar nova meta
│   │   ├── achievements/   # 17 conquistas (Bronze→Diamante)
│   │   ├── notifications/  # Centro de notificações
│   │   └── onboarding/     # Primeiro uso (3 passos)
│   ├── auth/               # Login, Register, Forgot/Reset Password, OAuth Callback
│   ├── api/cron/           # Crons: daily-push, inactivity-alert, friend-streaks, weekly-summary
│   ├── landing/            # Landing page pública (10 dobras)
│   ├── invite/             # Aceitar convite de apoiador ou ofensiva de amigos
│   ├── termos/             # Termos de uso
│   └── privacidade/        # Política de privacidade (LGPD)
├── components/
│   ├── layout/             # BottomTabBar, ThemeProvider, AuthLayout, CookieConsent, PWA, NotificationBell
│   ├── home/               # SupportMessages, WeeklySummary
│   ├── history/            # CheckinHeatmap, WeeklyScoreChart, MoodDistribution
│   └── ui/                 # Skeleton, AchievementToast, Confetti, QrCode
├── lib/
│   ├── actions/            # Server actions (goals, checkins, supporters, messages, friendships, friend-streaks, notifications)
│   ├── supabase/           # Client, Server, Middleware
│   ├── types.ts            # Tipos + SCORE_OPTIONS + ACHIEVEMENT_SEEDS + TARGET_DAYS_OPTIONS
│   ├── ensure-profile.ts   # Fallback para criar perfil se trigger não disparou
│   ├── web-push.ts         # Push notifications via VAPID
│   ├── email.ts            # Envio via Resend
│   ├── email-templates.ts  # Templates: daily reminder, inactivity, weekly report, difficult day
│   └── offline.ts          # IndexedDB para check-in offline
├── __tests__/              # 202 testes (Vitest + Testing Library)
├── middleware.ts            # Auth guard (rotas protegidas, callback excluído)
└── supabase/
    ├── schema.sql           # 10 tabelas + RLS + Storage + seed + trigger (fonte única)
    └── edge-functions/      # Templates de email
```

## Convenções

- **CSS vars**: todas com prefixo `--mf-` (evita conflito com Tailwind v4)
- **Tema**: light default, dark via `data-theme="dark"` no `<html>`
- **Auth**: Supabase Auth com email/senha + Google OAuth
- **Inline styles**: `style={{ color: "var(--mf-text)" }}` (Tailwind v4 não gera classes para CSS vars custom)
- **Server actions**: `src/lib/actions/` — usam `createClient` do server
- **Client operations**: onboarding e invite usam `createClient` do browser
- **Loading states**: cada rota tem `loading.tsx` com skeleton (exceto checkin que usa spinner)
- **Portals**: modais usam `createPortal(modal, document.body)` para evitar problemas de z-index

## Comandos

```bash
npm run dev          # Dev server
npm run dev:clean    # rm -rf .next && dev (resolve 500 por cache corrompido)
npm run build        # Build produção
npm test             # Rodar testes (vitest run)
npm run test:watch   # Testes em modo watch
```

## Features principais

### Ofensiva de Amigos (Duolingo-like)
- Streak compartilhado com duração definida (7/14/21/30/60/90 dias)
- Cada pessoa escolhe uma meta + visibilidade (pública ou "Meta privada 🔒")
- Ambos precisam fazer check-in diário na meta escolhida
- Cutucar (👋) aparece no pós check-in e na rede
- Cron diário (03:00 UTC) avalia e incrementa/quebra streaks
- 4 achievements específicos (Parceiros, Trio de Fogo, Guardião, Lenda)
- Tabela: `friend_streaks`

### Gamificação
- 17 conquistas (Bronze→Diamante) incluindo 4 de ofensiva de amigos
- Toast animado ao desbloquear + confetti em milestones
- Achievement engine automático no check-in

### Check-in inteligente (botão +)
- 0 metas → "Crie sua primeira meta"
- 1 meta pendente → vai direto pro check-in
- 2+ metas pendentes → mostra picker com lista
- Todas feitas → "Tudo feito por hoje!"

### Gestão de metas
- Menu ⋮ em cada meta na Home: pausar, reativar, concluir

### Crons (Vercel)
| Cron | Horário | Descrição |
|------|---------|-----------|
| daily-push | 21:00 UTC (18h BRT) | Lembrete diário (push + email + in-app) |
| inactivity-alert | 15:00 UTC (12h BRT) | Alerta apoiadores de inatividade 48h |
| friend-streaks | 03:00 UTC (0h BRT) | Avalia ofensivas de amigos |
| weekly-summary | 21:00 UTC domingos | Resumo semanal (push + email + in-app) |

## Problemas conhecidos

- **500 após editar arquivos**: Turbopack corrompe `.next/`. Rode `npm run dev:clean`.
- **`turbopack.root`**: Configurado em `next.config.ts` para evitar conflito com lockfiles externos.
- **Hydration warning**: `suppressHydrationWarning` no `<body>` por causa de extensões de browser.

## Banco de dados

Schema completo em `supabase/schema.sql` (fonte única — rodar do zero em banco limpo).

10 tabelas: users, goals, checkins, supporters, messages, friendships, friend_streaks, achievements, user_achievements, notifications.

Storage: bucket `avatars` (público, RLS por user ID).

## Brand

- Cor primária: `#2D6A4F` (Forest Green)
- Fontes: Outfit (display), Plus Jakarta Sans (body), JetBrains Mono (data)
- Tom de voz: amigo próximo, firme mas gentil
- Brandbook: [brand.maisfortes.com.br](https://brand.maisfortes.com.br)
