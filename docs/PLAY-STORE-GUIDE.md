# +Fortes — Guia de Publicação na Google Play Store

> O +Fortes é uma PWA. Para publicar na Play Store, usamos **TWA (Trusted Web Activity)** via **PWABuilder** ou **Bubblewrap**. Não é necessário reescrever o app em código nativo.

---

## Pré-requisitos

### 1. Conta de Desenvolvedor Google Play
- Acesse: https://play.google.com/console
- Taxa única: **US$ 25**
- Preencha: nome, e-mail, endereço, telefone
- Verificação de identidade obrigatória (documento + comprovante)
- Tempo: aprovação pode levar 48h

### 2. Certificado Digital Asset Links
O TWA exige que você prove que é dono do domínio. Crie o arquivo:

**Localização:** `https://maisfortes.com.br/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "br.com.maisfortes.app",
      "sha256_cert_fingerprints": ["SEU_SHA256_AQUI"]
    }
  }
]
```

> O SHA256 será gerado ao criar o APK com PWABuilder ou Bubblewrap (passo 4).

### 3. Ícones necessários

Você já tem `icon-192.png` e `icon-512.png`. Para a Play Store, prepare também:

| Asset | Tamanho | Uso |
|-------|---------|-----|
| **Ícone do app** | 512x512 PNG (32-bit, sem transparência) | Ícone na loja e no dispositivo |
| **Feature Graphic** | 1024x500 PNG/JPG | Banner principal na listagem |
| **Screenshots celular** | Mínimo 2, tamanho 1080x1920 ou 1920x1080 | Galeria da listagem |
| **Screenshots tablet** (opcional) | 1200x1920 ou 1920x1200 | Galeria para tablets |

---

## Passo 1 — Gerar o APK/AAB via PWABuilder

A forma mais simples. Sem instalar nada.

1. Acesse: https://www.pwabuilder.com
2. Cole: `https://maisfortes.com.br`
3. Clique **Start**
4. PWABuilder vai analisar seu manifest e service worker
5. Clique **Package for stores** → **Android**
6. Preencha:
   - **Package ID:** `br.com.maisfortes.app`
   - **App name:** `+Fortes`
   - **App version:** `1.0.0`
   - **Display mode:** Standalone
   - **Status bar color:** `#2D6A4F`
   - **Navigation bar color:** `#FFFFFF`
   - **Signing key:** Generate new (guarde a senha!)
7. Clique **Generate**
8. Baixe o `.aab` (Android App Bundle) e o `signing-key-info.txt`

> **IMPORTANTE:** Guarde o keystore e senha em local seguro. Você vai precisar para cada atualização futura.

### Alternativa: Bubblewrap (CLI)

```bash
npm i -g @nicolo-ribaudo/bubblewrap
bubblewrap init --manifest=https://maisfortes.com.br/manifest.json
bubblewrap build
```

---

## Passo 2 — Configurar Digital Asset Links

Após gerar o APK, o PWABuilder/Bubblewrap fornece o **SHA256 fingerprint**.

1. Crie o arquivo `public/.well-known/assetlinks.json` no projeto
2. Cole o conteúdo com o SHA256 fornecido
3. Deploy no Vercel
4. Teste: `https://maisfortes.com.br/.well-known/assetlinks.json` deve retornar o JSON

> Sem isso, o app abre no Chrome em vez de tela cheia.

---

## Passo 3 — Criar a listagem na Play Console

### Informações do app

| Campo | Valor |
|-------|-------|
| **Nome do app** | +Fortes |
| **Idioma padrão** | Português (Brasil) |
| **Tipo de app** | App |
| **Gratuito ou pago** | Gratuito |
| **Categoria** | Saúde e fitness |
| **Tags** | Saúde mental, Bem-estar, Hábitos, Autoajuda |

### Descrição curta (80 caracteres máx.)

```
Acompanhe sua jornada de mudança com rede de apoio e streaks diários.
```

### Descrição completa (4000 caracteres máx.)

```
+Fortes é uma plataforma gratuita de acompanhamento para quem quer mudar um comportamento e não quer fazer isso sozinho.

Seja parar de fumar, controlar a ansiedade, manter uma dieta ou qualquer outro objetivo — o +Fortes te ajuda a registrar como está cada dia, manter a consistência com streaks, e contar com uma rede de apoio real.

COMO FUNCIONA

• Defina suas metas — o que você quer mudar
• Faça check-in diário — registre como foi seu dia (score de 1 a 5)
• Construa seu streak — dias consecutivos de check-in
• Convide apoiadores — amigos e família acompanham sua jornada
• Ofensiva de amigos — streak compartilhado estilo Duolingo, com duração definida
• Receba mensagens de incentivo — sua rede pode enviar apoio direto

RECURSOS PRINCIPAIS

✓ Check-in diário com score e nota (funciona offline)
✓ Streaks automáticos com recálculo inteligente
✓ Múltiplas metas simultâneas
✓ Rede de apoio com convite por link
✓ Ofensiva de amigos com duração (7 a 90 dias)
✓ Meta privada — esconda o nome da meta de quem quiser
✓ 17 conquistas (Bronze → Diamante)
✓ Modo dia difícil — recursos de apoio + CVV (188)
✓ Heatmap estilo GitHub dos seus check-ins
✓ Gráficos de score e humor
✓ Resumo semanal com estatísticas
✓ Notificações push diárias
✓ Tema light e dark
✓ Funciona offline (PWA)
✓ 100% gratuito, sem anúncios

PARA QUEM É

• Quem quer parar de fumar, beber ou qualquer vício
• Quem quer criar hábitos saudáveis
• Quem precisa de consistência e accountability
• Quem quer acompanhar o progresso de forma visual
• Quem valoriza ter uma rede de apoio acompanhando

PRIVACIDADE

• Seus dados são seus — sem venda de informações
• Metas podem ser privadas (amigos veem só o streak, não o nome)
• Conformidade com LGPD
• Código aberto: github.com/wilderamorim/maisfortes.com.br

O +Fortes não substitui acompanhamento profissional. Se você está em crise, ligue para o CVV: 188 (24h, gratuito).

Feito com 💚 por quem acredita que ninguém precisa mudar sozinho.
```

### Política de privacidade URL

```
https://maisfortes.com.br/privacidade
```

---

## Passo 4 — Screenshots

A Play Store exige no mínimo **2 screenshots de celular**. Recomendo 5-6.

### Screenshots recomendados (1080x1920, modo portrait)

Tire estas telas do app em produção (https://maisfortes.com.br):

| # | Tela | O que mostrar | Texto overlay sugerido |
|---|------|---------------|----------------------|
| 1 | **Home** | Metas com streaks, check-in feito | "Acompanhe suas metas todo dia" |
| 2 | **Check-in** | Seleção de score (emojis) | "Registre como foi seu dia" |
| 3 | **Histórico + Heatmap** | Calendário verde com check-ins | "Visualize sua consistência" |
| 4 | **Rede de apoio** | Ofensiva de amigos com ✅/⏳ | "Conte com quem te apoia" |
| 5 | **Conquistas** | Grid de badges desbloqueados | "Desbloqueie conquistas" |
| 6 | **Modo dia difícil** | Tela de apoio com CVV | "Suporte nos dias mais difíceis" |

### Como tirar os screenshots

**Opção 1 — Chrome DevTools (mais fácil):**
1. Abra `https://maisfortes.com.br` no Chrome
2. F12 → Toggle device toolbar (Ctrl+Shift+M)
3. Selecione "Pixel 7" ou resolução 412x915
4. Navegue até a tela
5. Ctrl+Shift+P → "Capture screenshot"
6. Redimensione para 1080x1920 se necessário

**Opção 2 — Celular real:**
1. Abra o app no celular
2. Tire print (Power + Volume Baixo)

### Feature Graphic (1024x500)

Banner que aparece no topo da listagem. Sugestão de conteúdo:

```
[Logo +Fortes à esquerda]
+Forte a cada dia.
Acompanhamento com rede de apoio.
[Mockup do app à direita]
```

Cores: fundo branco ou `#FAFAF8`, texto `#1A1A1A`, destaque `#2D6A4F`.

---

## Passo 5 — Classificação de conteúdo

O Google exige que você preencha um questionário de classificação.

### Respostas para o +Fortes

| Pergunta | Resposta |
|----------|---------|
| Violência | Não |
| Conteúdo sexual | Não |
| Linguagem | Não |
| Substâncias controladas | **Sim — referências** (o app trata de vícios, mas não promove) |
| Conteúdo gerado pelo usuário | **Sim** (mensagens entre apoiadores) |
| Compartilhamento de localização | Não |
| Compras no app | Não |
| Anúncios | Não |

**Classificação esperada:** Livre (L) ou 10+ dependendo da avaliação do Google.

---

## Passo 6 — Declarações obrigatórias

### Política de privacidade
URL: `https://maisfortes.com.br/privacidade` (já existe)

### Práticas de dados (Data Safety)

| Dado | Coleta | Compartilha | Obrigatório |
|------|--------|-------------|-------------|
| Nome | Sim | Não | Sim (conta) |
| E-mail | Sim | Não | Sim (conta) |
| Dados de saúde/fitness | Sim (check-ins) | Não | Sim (funcionalidade) |
| Mensagens | Sim (apoio) | Não | Não (opcional) |
| Foto de perfil | Sim (avatar) | Não | Não (opcional) |

**Criptografia em trânsito:** Sim (HTTPS)
**Exclusão de dados:** Sim (o usuário pode solicitar via email)

### Público-alvo
- Faixa etária: **18+** (o app trata de vícios)
- Não é direcionado a crianças

### Funcionalidade do app
- **Não** é app de jogos de azar
- **Não** é app financeiro
- **Não** é app de saúde regulamentado
- **É** app de bem-estar/hábitos (categoria geral)

---

## Passo 7 — Upload e publicação

1. Na Play Console, vá em **Release** → **Production**
2. Clique **Create new release**
3. Faça upload do `.aab` gerado no passo 1
4. Preencha **Release notes:**

```
Versão 1.0.0 — Lançamento

• Check-in diário com score e humor
• Múltiplas metas simultâneas
• Streaks automáticos
• Rede de apoio com convite por link
• Ofensiva de amigos (streak compartilhado)
• 17 conquistas desbloqueáveis
• Heatmap de check-ins
• Notificações push
• Modo dia difícil com CVV
• Tema light/dark
• Funciona offline
```

5. Clique **Review release** → **Start rollout to Production**
6. Aguarde revisão do Google (geralmente 1-7 dias, primeira vez pode ser mais)

---

## Passo 8 — Após publicação

### Monitorar
- Play Console → **Statistics** (instalações, desinstalações)
- Play Console → **Ratings & reviews** (responder reviews)
- Play Console → **Crashes & ANRs** (TWA raramente tem crashes)

### Atualizar
Para cada update:
1. Atualize o app web normalmente (deploy Vercel)
2. O TWA carrega a web automaticamente — **não precisa publicar novo APK**
3. Só publique novo APK se mudar ícone, nome, manifest, ou o Google exigir

---

## Checklist final

- [ ] Conta de desenvolvedor Google Play criada (US$ 25)
- [ ] Ícone 512x512 PNG sem transparência
- [ ] Feature Graphic 1024x500
- [ ] 4-6 screenshots 1080x1920
- [ ] APK/AAB gerado via PWABuilder
- [ ] assetlinks.json publicado em `/.well-known/`
- [ ] Descrição curta e completa preenchidas
- [ ] Política de privacidade URL configurada
- [ ] Classificação de conteúdo preenchida
- [ ] Data Safety preenchido
- [ ] Release notes escritas
- [ ] Upload do AAB + publicação

---

## Custos

| Item | Valor | Recorrência |
|------|-------|-------------|
| Conta Google Play | US$ 25 | Única |
| PWABuilder | Gratuito | — |
| Certificado SSL | Já incluso (Vercel) | — |
| **Total** | **~R$ 130** | **Único** |

---

## Referências

- [PWABuilder](https://www.pwabuilder.com)
- [Bubblewrap CLI](https://github.com/nicolo-ribaudo/nicolo-nicolo-nicolo-nicolo-nicolo/nicolo-nicolo/nicolo-nicolo/nicolo-bubblewrap)
- [Digital Asset Links](https://developers.google.com/digital-asset-links)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity)
