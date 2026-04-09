# +Fortes — Plataforma de Acompanhamento com Rede de Apoio

> Ninguem muda sozinho. +Fortes conecta quem esta na jornada de mudanca com quem apoia.

**Live:** [maisfortes.com.br](https://maisfortes.com.br)

---

## Sobre

+Fortes e uma plataforma **gratuita** que ajuda pessoas a mudarem comportamentos por meio de check-ins diarios e accountability social — conectando quem esta na jornada com quem apoia.

### O problema

Pessoas que enfrentam vicios ou buscam mudancas importantes sofrem com:
- Falta de acompanhamento constante
- Isolamento emocional
- Dificuldade em manter disciplina
- Pouco envolvimento estruturado da familia

### A solucao

Uma rede de apoio estruturada com:
- Monitoramento diario de progresso (check-in)
- Participacao ativa de pessoas de confianca
- Alertas em caso de inatividade
- Controle total de privacidade pelo protagonista

## Usuarios

| Papel | Descricao |
|-------|-----------|
| **Protagonista** | Quem esta na jornada de mudanca — define metas, faz check-in diario |
| **Apoiador** | Quem acompanha e apoia — ve progresso, envia incentivo |
| **Profissional** (futuro) | Terapeuta, nutricionista — acompanha evolucao |

## Features (MVP)

- [x] Cadastro e autenticacao (email/social login)
- [x] Criar meta pessoal
- [x] Check-in diario (score 1-5 + nota opcional)
- [x] Streak (dias consecutivos)
- [x] Convidar apoiadores (max 5)
- [x] Dashboard do apoiador
- [x] Alerta de inatividade (48h)
- [ ] Mensagem de incentivo
- [ ] Historico de check-ins
- [ ] Perfil e configuracoes

## Stack Tecnica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | [Next.js 15](https://nextjs.org) (App Router) | SSR, PWA-ready, React ecosystem |
| UI | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) | Rapido, componentes prontos |
| Backend | [Supabase](https://supabase.com) | Auth, Postgres, Realtime, Storage — free tier |
| Notificacoes | Supabase Edge Functions + Web Push | Alertas de inatividade |
| Hosting | [Vercel](https://vercel.com) | Free tier, deploy automatico |

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

### Pre-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (free tier)
- npm, yarn ou pnpm

### Instalacao

```bash
git clone https://github.com/wilderamorim/maisfortes.com.br.git
cd maisfortes.com.br
npm install
```

### Variaveis de ambiente

Crie um arquivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### Comandos

```bash
npm run dev       # Servidor de desenvolvimento (http://localhost:3000)
npm run build     # Build para producao
npm run start     # Iniciar em producao
npm run lint      # Verificar codigo
```

## Contribuicao

Este e um projeto pessoal com proposito social. Contribuicoes sao muito bem-vindas!

### Como contribuir

1. Faca um fork do repositorio
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faca commit das suas mudancas (`git commit -m 'feat: descricao da feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

### Convencoes

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)
- **Branches:** `feature/`, `fix/`, `docs/`
- **Componentes:** PascalCase, TypeScript
- **Testes:** Escreva testes para funcionalidades novas
- **Acessibilidade:** WCAG 2.1 AA minimo
- **Privacidade:** Dados sensíveis nunca no client-side

### Areas onde precisamos de ajuda

- **Frontend:** Componentes React, PWA, animacoes
- **Backend:** Supabase RLS policies, Edge Functions
- **Design:** UI/UX, ilustracoes, animacoes
- **Traducao:** Internacionalizacao futura
- **Testes:** Unit tests, E2E
- **Documentacao:** Guias, tutoriais

### Reportando issues

Use as [GitHub Issues](https://github.com/wilderamorim/maisfortes.com.br/issues) para:
- Bugs
- Feature requests
- Melhorias de UX
- Problemas de acessibilidade
- Questoes de privacidade/seguranca

## Regras de Negocio

| Regra | Descricao |
|-------|-----------|
| RN-01 | Protagonista controla 100% da visibilidade dos dados |
| RN-02 | Apoiador so ve dados apos convite aceito |
| RN-03 | Check-in diario — 1 por dia, editavel ate meia-noite |
| RN-04 | Streak quebra se nao fizer check-in em 1 dia completo |
| RN-05 | Alerta de inatividade apos 48h sem check-in |
| RN-06 | Maximo 5 apoiadores por protagonista (V1) |
| RN-07 | Protagonista pode remover apoiador a qualquer momento |
| RN-08 | Dados privados por padrao — nada e publico |

## Projetos Relacionados

| Projeto | Descricao | Repositorio |
|---------|-----------|-------------|
| **maisfortes.com.br** | Plataforma principal (este repo) | [wilderamorim/maisfortes.com.br](https://github.com/wilderamorim/maisfortes.com.br) |
| **brand.maisfortes.com.br** | Brandbook / Design System | [wilderamorim/brand.maisfortes.com.br](https://github.com/wilderamorim/brand.maisfortes.com.br) |

## Roadmap

| Fase | Escopo |
|------|--------|
| **V1 — MVP** | Auth, metas, check-in, streak, apoiadores, alertas |
| **V1.1** | Mensagens de incentivo, historico, perfil |
| **V2** | Multiplas metas, gamificacao leve |
| **V3** | Acesso profissional, relatorios |

## Licenca

Este projeto esta licenciado sob a [MIT License](LICENSE).

---

**+Fortes** — Juntos, somos mais fortes.
