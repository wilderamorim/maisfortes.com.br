# +Fortes — Guia de Atualização do App

## Como funciona a atualização

O +Fortes é um **TWA (Trusted Web Activity)** — o app na Play Store é basicamente o Chrome abrindo `maisfortes.com.br` em tela cheia. Isso significa:

### O que atualiza automaticamente (sem fazer nada na Play Store)

| O que | Como atualiza | Quando o usuário vê |
|-------|---------------|---------------------|
| **Todo o código do app** | Deploy no Vercel (git push) | Próxima vez que abrir o app |
| **UI, componentes, páginas** | Deploy no Vercel | Próxima vez que abrir o app |
| **Server actions, API routes** | Deploy no Vercel | Imediatamente |
| **Crons** | Deploy no Vercel | Na próxima execução do cron |
| **CSS, estilos, animações** | Deploy no Vercel | Próxima vez que abrir o app |
| **Dados (Supabase)** | Migration no SQL Editor | Imediatamente |
| **Email templates** | Deploy no Vercel | Na próxima notificação |
| **SEO, meta tags, JSON-LD** | Deploy no Vercel | Próximo crawl do Google |
| **Service Worker** | Deploy no Vercel | Próxima vez que abrir (auto-update) |

### O que precisa de novo AAB na Play Store

| O que | Quando |
|-------|--------|
| **Mudar o ícone do app** | Sim — novo AAB |
| **Mudar o nome do app** | Sim — novo AAB + update na listagem |
| **Mudar o package name** | Nunca (não pode mudar após publicar) |
| **Mudar a splash screen** | Sim — novo AAB |
| **Mudar a cor da barra de status** | Sim — novo AAB |
| **Atualizar a signing key** | Nunca (não pode mudar) |
| **Google exigir atualização** | Sim — quando o Google pedir |

---

## Rotina de atualização (dia a dia)

### 1. Desenvolver e testar localmente

```bash
npm run dev          # Desenvolver
npm test             # Rodar testes
npm run build        # Verificar se builda
```

### 2. Commit e push

```bash
git add .
git commit -m "feat: nova feature"
git push origin main
```

### 3. Deploy automático

O Vercel detecta o push e faz deploy automaticamente. Em ~1-2 minutos o app em produção está atualizado.

### 4. Verificar em produção

Acesse `maisfortes.com.br` e teste a mudança. O usuário que abrir o app depois disso já verá a versão nova.

**Pronto.** Não precisa fazer mais nada.

---

## Service Worker e cache

O Service Worker (`sw.js`) cacheia assets estáticos. Quando você faz deploy:

1. O Vercel serve os novos arquivos
2. Na próxima visita, o SW detecta que mudou (hash do cache muda)
3. O SW faz `skipWaiting()` e `clients.claim()` — atualiza automaticamente
4. O usuário vê a nova versão sem precisar fazer nada

### Se precisar forçar atualização

Se fizer uma mudança crítica e quiser que todos os usuários atualizem imediatamente, atualize o `CACHE_NAME` no `sw.js`:

```javascript
// public/sw.js
const CACHE_NAME = "maisfortes-NOVO_TIMESTAMP";
```

O script `scripts/version-sw.js` já faz isso automaticamente no `prebuild`.

---

## Quando precisar atualizar na Play Store

Isso é raro. Só acontece quando:

1. **Google exige** — ex: nova política de target API level
2. **Mudar ícone/nome** — requer novo AAB
3. **Mudar manifest.json** de forma que afete o TWA — ex: `theme_color`, `background_color`

### Como atualizar na Play Store

1. Gere novo AAB via PWABuilder ou Bubblewrap (mesmo processo da primeira vez)
2. Incremente o `versionCode` no build
3. Na Play Console → Release → Production → Create new release
4. Upload do novo AAB
5. Preencha release notes
6. Submit for review

### Release notes template

```
O que há de novo:
- [Descreva as mudanças visíveis para o usuário]
- Melhorias de desempenho e correções
```

---

## Checklist de deploy

### Deploy normal (código/features)

- [ ] Testes passando (`npm test`)
- [ ] Build sem erros (`npm run build`)
- [ ] Commit com mensagem descritiva
- [ ] Push para main
- [ ] Verificar em produção (abrir maisfortes.com.br)

### Deploy com mudança de banco

- [ ] Tudo acima +
- [ ] Migration SQL testada localmente
- [ ] Migration rodada no Supabase SQL Editor
- [ ] `supabase/schema.sql` atualizado (fonte única)
- [ ] Testar fluxo afetado em produção

### Deploy com mudança de env vars

- [ ] Tudo acima +
- [ ] Variável adicionada no Vercel (Settings → Environment Variables)
- [ ] Redeploy no Vercel (ou push novo commit)

### Atualização na Play Store (raro)

- [ ] Gerar novo AAB
- [ ] Incrementar versionCode
- [ ] Upload na Play Console
- [ ] Release notes escritas
- [ ] Submit for review
- [ ] Aguardar aprovação (1-7 dias)

---

## Resumo

| Ação | Frequência | O que fazer |
|------|-----------|-------------|
| **Atualizar código** | Sempre que quiser | `git push` → Vercel deploya |
| **Atualizar banco** | Quando mudar schema | SQL no Supabase + push |
| **Atualizar Play Store** | Quase nunca | Só se mudar ícone/nome ou Google exigir |
| **Usuário precisa atualizar** | Nunca | O app atualiza sozinho |

**A grande vantagem do TWA/PWA: você faz deploy e todos os usuários recebem a atualização automaticamente, sem precisar baixar nada.**
