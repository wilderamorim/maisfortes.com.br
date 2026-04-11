# +Fortes — Status do MVP

> **Progresso: 95/98 tasks (97%)**
> **Atualizado: 2026-04-11**

---

## O que está PRONTO no MVP

### Core (100%)
- [x] Auth completo (email/senha + Google OAuth + recuperação de senha)
- [x] Múltiplas metas simultâneas (criar, listar, ordenar)
- [x] Check-in diário (score 1-5 + nota + mood)
- [x] Streak automático com recálculo na home
- [x] Histórico de check-ins por meta (timeline)

### Social (90%)
- [x] Convidar apoiador por link (reutiliza convite pendente)
- [x] Aceitar convite (página pública)
- [x] Dashboard do apoiador (rede com metas)
- [x] Mensagens de incentivo (server action)
- [x] Reações rápidas (4 emojis)
- [x] Streak de amigos (adicionar por link, mural de streaks)
- [x] Privacidade granular por meta (can_see_score, can_see_notes)
- [x] Remover apoiador

### Gamificação (85%)
- [x] 13 conquistas (Bronze → Diamante)
- [x] Achievement engine (desbloqueio automático)
- [x] Página de conquistas (locked/unlocked, raridade)
- [x] Conquista "Multi-Jornada" (2+ metas)
- [x] Conquista "Volta por Cima" (retomar streak)

### Engajamento (90%)
- [x] Onboarding guiado (3 passos, apoiador opcional)
- [x] Sistema de notificações in-app (sininho + badge)
- [x] Centro de notificações (página)
- [x] Push Permission component
- [x] Service Worker com push handler
- [x] Push diário "Ei, como foi hoje?" com horário configurável
- [x] Alerta de inatividade 48h para apoiadores
- [x] Modo dia difícil (score 1 → tela de apoio + CVV)
- [x] Mensagens/reações visíveis na Home
- [x] Configuração de notificações no perfil

### Perfil (80%)
- [x] Perfil com avatar, nome, stats (check-ins, streak atual, melhor streak, conquistas)
- [x] Toggle tema light/dark
- [x] Logout
- [x] Links para conquistas e privacidade

### Landing & Técnico (85%)
- [x] Landing page com 10 dobras + mockup HTML animado
- [x] PWA manifest + Service Worker
- [x] Offline check-in (IndexedDB)
- [x] Cookie consent banner
- [x] PWA install banner (iOS guide + Android prompt)
- [x] Termos de uso (12 seções)
- [x] Política de privacidade (12 seções LGPD)
- [x] 404 personalizada
- [x] Auth layout split (estilo Rocketseat)

---

## O que FALTA para o MVP (19 tasks)

### Prioridade ALTA — Precisa para lançar

| # | Task | Impacto |
|---|------|---------|
| ~~**8.13**~~ | ~~Deploy no Vercel + domínio maisfortes.com.br~~ | ✅ **FEITO** (2026-04-10) |
| ~~**5.8**~~ | ~~Edge Function para push diário ("Ei, como foi hoje?")~~ | ✅ **FEITO** (2026-04-10) |
| ~~**5.9**~~ | ~~Push configurável (horário do lembrete)~~ | ✅ **FEITO** (2026-04-10) |
| ~~**5.10**~~ | ~~Push de alerta para apoiadores (inatividade 48h)~~ | ✅ **FEITO** (2026-04-10) |
| ~~**5.14**~~ | ~~Modo "dia difícil" (score 1 → recursos de apoio)~~ | ✅ **FEITO** (2026-04-10) |
| ~~**5.15**~~ | ~~Tela especial: "Quer falar com alguém da sua rede?"~~ | ✅ **FEITO** (2026-04-10) |
| ~~**3.14**~~ | ~~Mostrar mensagens/reações na Home~~ | ✅ **FEITO** (2026-04-10) |

### Prioridade MÉDIA — Melhora a experiência

| # | Task | Impacto |
|---|------|---------|
| ~~**4.7**~~ | ~~Toast ao desbloquear conquista~~ | ✅ **FEITO** (2026-04-11) |
| ~~**4.8**~~ | ~~Animação de celebração (milestones)~~ | ✅ **FEITO** (2026-04-11) |
| ~~**2.4**~~ | ~~Pausar / reativar / completar meta~~ | ✅ **FEITO** (2026-04-11) |
| ~~**5.11**~~ | ~~Resumo semanal (cron domingo)~~ | ✅ **FEITO** (2026-04-11) |
| ~~**5.13**~~ | ~~Card de resumo na Home (domingo/segunda)~~ | ✅ **FEITO** (2026-04-11) |
| ~~**6.2**~~ | ~~Upload de avatar~~ | ✅ **FEITO** (2026-04-11) |
| ~~**5.16**~~ | ~~Configuração de notificações no perfil~~ | ✅ **FEITO** (2026-04-11) — fixo 18h BRT |

### Prioridade BAIXA — Nice to have

| # | Task | Impacto |
|---|------|---------|
| **3.3** | QR code do link de convite | Alternativa ao link |
| **2.13** | Gráfico de score semanal | Visualização de dados |
| **2.14** | Gráfico de distribuição de humor | Visualização de dados |
| **4.9** | Confetti/particles na celebração | Polish visual |
| **4.13** | Nudge quando amigo quebra streak | Social sutil |

---

## O que fica DEPOIS do MVP (V1.1+)

### V1.1 — Após validação com usuários reais

| Feature | Descrição |
|---------|-----------|
| Relatório mensal | Evolução mês a mês com gráficos |
| Temas personalizados | Além de light/dark — cores, fontes |
| Deep links | Abrir app direto na meta/check-in via link |
| Upload de avatar | Foto de perfil (Supabase Storage) |
| Exportar dados | JSON com todos os check-ins e metas |
| Gráficos de score/mood | Bar chart semanal + mood breakdown |
| Grain overlay na landing | Textura sutil visual |
| Animated counters na landing | Números animados no scroll |

### V2 — Com base em feedback real

| Feature | Descrição |
|---------|-----------|
| Acesso profissional | Terapeuta/nutricionista vê relatórios |
| Grupos de apoio | Múltiplos protagonistas em um grupo |
| Integração wearables | Dados de saúde do Apple Watch/Fitbit |
| Calendário visual | Heatmap estilo GitHub de check-ins |
| Metas com prazo | "90 dias sem álcool" com countdown |
| Diário emocional | Texto longo além da nota do check-in |
| Chat em tempo real | Mensagens instantâneas com apoiador |
| Templates de meta | "Parar de beber", "Emagrecer" pré-configurados |

### V3 — Escala

| Feature | Descrição |
|---------|-----------|
| App nativo (React Native) | Performance nativa, notificações melhores |
| Marketplace de conquistas | Conquistas customizadas por comunidade |
| API pública | Integração com outros apps de saúde |
| Multi-idioma | Inglês, espanhol |
| Monetização (opcional) | Plano premium para profissionais (app continua grátis para usuários) |

---

## Recomendação para lançar

**MVP mínimo para lançar — TODAS AS TASKS CONCLUÍDAS ✅**

1. ~~Deploy no Vercel (**8.13**)~~ ✅ FEITO
2. ~~Push diário + configuração (**5.8, 5.9**)~~ ✅ FEITO
3. ~~Alerta para apoiadores (**5.10**)~~ ✅ FEITO
4. ~~Mensagens na Home (**3.14**)~~ ✅ FEITO
5. ~~Modo dia difícil (**5.14, 5.15**)~~ ✅ FEITO

**Com essas 7 tasks, o app tem:**
- Fluxo completo: cadastro → meta → check-in → streak → conquistas
- Rede de apoio funcional: convite → acompanhar → mensagens
- Retenção: push diário + alertas + gamificação
- Suporte emocional: modo dia difícil

**Tudo o resto pode ser iterado após lançar com usuários reais.**
