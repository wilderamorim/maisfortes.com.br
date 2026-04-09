# +Fortes — Plataforma de Acompanhamento com Rede de Apoio

> Ninguém muda sozinho. +Fortes conecta quem está na jornada de mudança com quem apoia.

**Live:** [maisfortes.com.br](https://maisfortes.com.br)

---

## Sobre

+Fortes é uma plataforma **gratuita** que ajuda pessoas a mudarem comportamentos por meio de check-ins diários e accountability social — conectando quem está na jornada com quem apoia.

### O problema

Pessoas que enfrentam vícios ou buscam mudanças importantes sofrem com:
- Falta de acompanhamento constante
- Isolamento emocional
- Dificuldade em manter disciplina
- Pouco envolvimento estruturado da família

### A solução

Uma rede de apoio estruturada com:
- Monitoramento diário de progresso (check-in)
- Participação ativa de pessoas de confiança
- Alertas em caso de inatividade
- Controle total de privacidade pelo protagonista

## Usuários

| Papel | Descrição |
|-------|-----------|
| **Protagonista** | Quem está na jornada de mudança — define metas, faz check-in diário |
| **Apoiador** | Quem acompanha e apoia — vê progresso, envia incentivo |
| **Profissional** (futuro) | Terapeuta, nutricionista — acompanha evolução |

## Features (MVP — 26 features)

### Core
- [ ] Cadastro e autenticação (email/social login)
- [ ] Múltiplas metas simultâneas (ex: álcool + dieta)
- [ ] Check-in diário por meta (score 1-5 + nota opcional)
- [ ] Streak pessoal por meta + calendário visual
- [ ] Histórico de check-ins (timeline + filtro por meta)

### Social & Rede de Apoio
- [ ] Convidar apoiador (opcional, por link/QR code, máx. 5 por meta)
- [ ] Dashboard do apoiador (feed de atividade)
- [ ] Alerta de inatividade (push após 48h)
- [ ] Mensagem de incentivo
- [ ] Streak de amigos (mural de constância estilo Duolingo)
- [ ] Reação rápida (coração, força, palma, abraço)

### Gamificação
- [ ] Conquistas / Troféus (Bronze → Prata → Ouro → Platina → Diamante)
- [ ] Celebração de milestone (animação ao atingir 7, 30, 90, 365 dias)

### Engajamento
- [ ] Onboarding guiado (4 passos, apoiador é opcional)
- [ ] Push notifications (lembrete diário de check-in)
- [ ] Resumo semanal (enviado todo domingo)
- [ ] Modo "dia difícil" (score 1 → recursos de apoio)

### Perfil & Privacidade
- [ ] Perfil e configurações (foto, nome, tema light/dark)
- [ ] Privacidade granular por meta (quem vê o quê)

### Landing Page & Técnico
- [ ] Landing page com mockup HTML animado do app
- [ ] PWA instalável (ícone na home, fullscreen, splash screen)
- [ ] Offline check-in (salva local, sincroniza depois)
- [ ] Haptic feedback (vibração ao selecionar score)

## Stack Técnica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | [Next.js 15](https://nextjs.org) (App Router) | SSR, PWA-ready, React ecosystem |
| UI | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) | Rápido, componentes prontos |
| Backend | [Supabase](https://supabase.com) | Auth, Postgres, Realtime, Storage — free tier |
| Notificações | Supabase Edge Functions + Web Push | Alertas de inatividade |
| Hosting | [Vercel](https://vercel.com) | Free tier, deploy automático |

**Custo estimado: R$ 0** (tudo no free tier)

## Modelo de Dados

```
users
├── id, email, name, avatar_url, created_at

goals
├── id, user_id (FK), title, description, status, created_at

checkins
├── id, goal_id (FK), date (unique/goal), score (1-5), note, mood, created_at

supporters
├── id, goal_id (FK), user_id (FK), status, invited_at, accepted_at

messages
├── id, goal_id (FK), from_user_id, to_user_id, content, created_at
```

## Desenvolvimento

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (free tier)
- npm, yarn ou pnpm

### Instalação

```bash
git clone https://github.com/wilderamorim/maisfortes.com.br.git
cd maisfortes.com.br
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### Comandos

```bash
npm run dev       # Servidor de desenvolvimento (http://localhost:3000)
npm run build     # Build para produção
npm run start     # Iniciar em produção
npm run lint      # Verificar código
```

## Contribuição

Este é um projeto pessoal com propósito social. Contribuições são muito bem-vindas!

### Como contribuir

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das suas mudanças (`git commit -m 'feat: descrição da feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

### Convenções

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)
- **Branches:** `feature/`, `fix/`, `docs/`
- **Componentes:** PascalCase, TypeScript
- **Testes:** Escreva testes para funcionalidades novas
- **Acessibilidade:** WCAG 2.1 AA mínimo
- **Privacidade:** Dados sensíveis nunca no client-side

### Áreas onde precisamos de ajuda

- **Frontend:** Componentes React, PWA, animações
- **Backend:** Supabase RLS policies, Edge Functions
- **Design:** UI/UX, ilustrações, animações
- **Tradução:** Internacionalização futura
- **Testes:** Unit tests, E2E
- **Documentação:** Guias, tutoriais

### Reportando issues

Use as [GitHub Issues](https://github.com/wilderamorim/maisfortes.com.br/issues) para:
- Bugs
- Feature requests
- Melhorias de UX
- Problemas de acessibilidade
- Questões de privacidade/segurança

## Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| RN-01 | Protagonista controla 100% da visibilidade dos dados |
| RN-02 | Apoiador só vê dados após convite aceito |
| RN-03 | Check-in diário por meta — 1 por dia por meta, editável até meia-noite |
| RN-04 | Streak quebra se não fizer check-in em 1 dia completo |
| RN-05 | Alerta de inatividade após 48h sem check-in |
| RN-06 | Máximo 5 apoiadores por meta |
| RN-07 | Protagonista pode remover apoiador a qualquer momento |
| RN-08 | Dados privados por padrão — nada é público |
| RN-09 | Convidar apoiador é 100% opcional |
| RN-10 | Privacidade granular por meta — apoiador pode ver Meta A mas não Meta B |
| RN-11 | Conquistas desbloqueadas automaticamente ao cumprir condição |
| RN-12 | Streak de amigos mostra apenas dias, nunca scores ou notas |

## Projetos Relacionados

| Projeto | Descrição | Repositório |
|---------|-----------|-------------|
| **maisfortes.com.br** | Plataforma principal (este repo) | [wilderamorim/maisfortes.com.br](https://github.com/wilderamorim/maisfortes.com.br) |
| **brand.maisfortes.com.br** | Brandbook / Design System | [wilderamorim/brand.maisfortes.com.br](https://github.com/wilderamorim/brand.maisfortes.com.br) |

## Roadmap

| Fase | Escopo |
|------|--------|
| **MVP** | 26 features: core + social + gamificação + landing page + PWA |
| **V1.1** | Relatório mensal, temas personalizados, deep links |
| **V2** | Acesso profissional, grupos de apoio, integração wearables |
| **V3** | App nativo (React Native), marketplace de conquistas |

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

**+Fortes** — Juntos, somos mais fortes.
