# +Fortes — maisfortes.com.br

Plataforma gratuita de acompanhamento com rede de apoio para mudança comportamental.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** com `@theme inline` e CSS custom properties (`--mf-*`)
- **Supabase** (Auth, Postgres, RLS, Edge Functions)
- **Lucide React** (ícones)
- PWA com Service Worker e Web Push

## Estrutura

```
src/
├── app/
│   ├── (app)/          # Rotas autenticadas (bottom tab bar)
│   │   ├── home/       # Dashboard com metas e streaks
│   │   ├── checkin/    # Check-in diário (score 1-5)
│   │   ├── history/    # Histórico de check-ins
│   │   ├── network/    # Rede de apoio + streak de amigos
│   │   ├── profile/    # Perfil, stats, conquistas, tema
│   │   ├── goals/      # Criar nova meta
│   │   ├── achievements/ # 13 conquistas (Bronze→Diamante)
│   │   ├── notifications/ # Centro de notificações
│   │   └── onboarding/ # Primeiro uso (3 passos)
│   ├── auth/           # Login, Register, Forgot/Reset Password
│   ├── landing/        # Landing page pública (10 dobras)
│   ├── invite/         # Aceitar convite de apoiador/amigo
│   ├── termos/         # Termos de uso
│   └── privacidade/    # Política de privacidade (LGPD)
├── components/layout/  # BottomTabBar, ThemeProvider, AuthLayout, CookieConsent, PWA, NotificationBell
├── lib/
│   ├── actions/        # Server actions (goals, checkins, supporters, messages, friendships, notifications)
│   ├── supabase/       # Client, Server, Middleware
│   ├── types.ts        # Tipos + SCORE_OPTIONS + ACHIEVEMENT_SEEDS
│   ├── ensure-profile.ts # Fallback para criar perfil se trigger não disparou
│   └── offline.ts      # IndexedDB para check-in offline
├── middleware.ts        # Auth guard (rotas protegidas)
└── supabase/
    ├── schema.sql       # 9 tabelas + RLS + seed + trigger
    └── edge-functions/  # Templates de email + weekly report
```

## Convenções

- **CSS vars**: todas com prefixo `--mf-` (evita conflito com Tailwind v4)
- **Tema**: light default, dark via `data-theme="dark"` no `<html>`
- **Auth**: Supabase Auth com email/senha + Google OAuth
- **Inline styles**: `style={{ color: "var(--mf-text)" }}` (Tailwind v4 não gera classes para CSS vars custom)
- **Server actions**: `src/lib/actions/` — usam `createClient` do server
- **Client operations**: onboarding e invite usam `createClient` do browser

## Comandos

```bash
npm run dev          # Dev server
npm run dev:clean    # rm -rf .next && dev (resolve 500 por cache corrompido)
npm run build        # Build produção
```

## Problemas conhecidos

- **500 após editar arquivos**: Turbopack corrompe `.next/`. Rode `npm run dev:clean`.
- **`turbopack.root`**: Configurado em `next.config.ts` para evitar conflito com lockfiles externos.

## Banco de dados

Schema completo em `supabase/schema.sql`. 9 tabelas: users, goals, checkins, supporters, messages, friendships, achievements, user_achievements, notifications.

## Brand

- Cor primária: `#2D6A4F` (Forest Green)
- Fontes: Outfit (display), Plus Jakarta Sans (body), JetBrains Mono (data)
- Tom de voz: amigo próximo, firme mas gentil
- Brandbook: [brand.maisfortes.com.br](https://brand.maisfortes.com.br)
