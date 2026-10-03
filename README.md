# Zuno (Prompts 1 a 5 de 5)

Plataforma de aprendizado de idiomas. Este é o projeto base: **continuar sempre neste mesmo projeto**.

## Como rodar

```bash
npm install
npm run build     # gera dist/index.html (app completo em um arquivo)
npm run dev       # recompila a cada alteração em src/
npm run preview   # serve dist/ em http://localhost:5173
npm run seed      # gera supabase/seed.sql a partir do conteúdo
npm run functions # copia as regras da IA para a função do servidor
```

`dist/index.html` pode ser hospedado em qualquer lugar estático (Netlify, Vercel, Hostinger, GitHub Pages).
`dist/artifact.html` é a mesma versão no formato de publicação do Claude.

## Regras de identidade (não quebrar)

- O Zuno é a arte oficial `src/assets/zuno.webp` (recorte da imagem enviada, fundo transparente).
- Nunca redesenhar, nunca adicionar pernas/pés, nunca usar como fundo, nunca encostar no chão.
- Ele sempre flutua (`src/styles/zuno.css`) e sempre tem **área própria** no layout.
- Cor da marca: verde do Zuno `#276556`. Fundo branco quente `#f6f5f0`. Texto quase preto `#131815`.
- Fontes gratuitas: Bricolage Grotesque (títulos/marca) e Figtree (texto).

## Estrutura

```
src/
  main.js                 entrada: restaura sessão e sobe o roteador
  routes.js               mapa de rotas (login é a primeira tela)
  config/
    app.config.js         marca, autenticação, planos Free/Plus, feature flags
    navigation.js         Início, Aprender, Modo Mundo, Progresso, Perfil
  core/                   dom helper, roteador por hash, store reativo, storage seguro
  services/
    auth/                 AuthService + provedores (local e Supabase)
    progress/             progresso individual por usuário
  domain/                 idiomas e modelos (curso, nível, aula, exercício)
  zuno/
    ZunoCharacter.js      o personagem flutuando (tamanhos xs → xl, companion)
    ZunoCompanion.js      Zuno das telas de aprendizado (coluna esquerda)
    zuno.states.js        estados emocionais, personalidades, evolução
  layouts/                AuthLayout, AppLayout (menu lateral / barra inferior), LessonLayout
  components/             botões, campos, progresso, métricas, seletor de idioma, ícones
  pages/                  auth/ (login, cadastro, recuperar) e app/ (5 seções)
  styles/                 tokens, base, zuno, componentes, layouts, páginas
```

## Autenticação

`config/app.config.js → AUTH.provider`

- `local` (padrão agora): contas reais neste navegador, senha com hash PBKDF2-SHA256 + sal.
  Limitação: a conta vale só no dispositivo e não envia e-mail de recuperação.
- `supabase`: contas na nuvem e e-mail de recuperação real. Preencher `url` e `anonKey`.

"Manter conectado" desmarcado = a sessão termina ao fechar a aba (o app volta a abrir no login).

## Responsividade

| Tela | Navegação | Zuno no aprendizado |
|---|---|---|
| Celular (< 768px) | barra inferior + topo leve | faixa própria no topo, à esquerda, com balão ao lado |
| Tablet (768–1099px) | trilho lateral compacto | coluna esquerda reservada, fixa ao rolar |
| Desktop (≥ 1100px) | menu lateral completo | coluna esquerda reservada, fixa ao rolar |

Testado em 320, 390, 844 (deitado), 820 e 1440px de largura, sem rolagem lateral.

## Próximos módulos (já preparados)

Ligar em `FEATURES` (app.config.js): `lessons`, `hardMode`, `worldMode`, `ai`,
`subscriptions`, `zunoEvolution`, `zunoPersonalities`.

- Novas artes do Zuno: adicionar em `ZUNO_ART` e apontar em `ZUNO_STATES`.
- Reações do Zuno nos exercícios: `companion.react(getReaction('correct'))`.
- Conclusão de aula: `ProgressService.completeLesson(...)` atualiza XP, tempo, palavras e sequência.

## Prompt 2 · Aprendizado

- **Aprender** (`#aprender`): 9 idiomas (Inglês, Espanhol, Italiano, Francês, Alemão, Japonês,
  Coreano, Mandarim, Português), com bandeira pequena em SVG próprio (emoji de bandeira não
  aparece no Windows).
- **Página do idioma** (`#idioma-en`): progresso do nível, níveis A1–C1 (C2 já previsto em
  `ACTIVE_LEVELS`) e a trilha vertical de unidades e aulas.
- **Aula** (`#aula-en-a1-u1-l1`): layout de foco, Zuno na coluna esquerda, múltipla escolha,
  feedback imediato. Errou? A pergunta volta no fim. Resumo com XP, acertos e palavras novas.
- **Plano Free** (`services/access/AccessPolicy.js`): todos os idiomas liberados; no A1 as 3
  primeiras aulas da Unidade 01 são grátis, o resto é Plus. Bloqueio = tela calma
  "Você chegou até aqui." (sem pop-up). Página `#plus` sem preço (assinatura ainda fechada).

### Conteúdo
`src/content/courses/` tem 4 aulas reais (16 exercícios) da Unidade 01 de cada idioma.
As Unidades 02 e 03 e os níveis A2–C1 já existem na estrutura e aparecem como "Em preparação".
Para adicionar conteúdo: escreva a aula no arquivo do idioma (ou direto no banco).

### Zuno nas aulas
- Acerto: arte feliz (`assets/zuno-happy.webp`), cresce, comemora, flutua mais e volta ao normal.
- Erro: estado `wrong` com balanço curto.
- Falas em `zuno/reactions.js`, sem repetir a anterior. Personalidades: **Light** ativa;
  **Provocador** e **Ofensivo** já registradas, só faltam as falas.

### Progresso real
`ProgressService` (v2) guarda por usuário: idiomas, nível, cada aula (acertos, XP, tempo,
tentativas, conclusão), XP, palavras aprendidas, tempo estudado, sequência e última atividade.
Dados do Prompt 1 são migrados automaticamente.

### Banco de dados (Supabase) · AÇÃO MANUAL NECESSÁRIA
O Supabase **ainda não está conectado** (faltam credenciais). Para ativar:
1. Crie um projeto em supabase.com.
2. SQL Editor → rode `supabase/schema.sql` e depois `supabase/seed.sql`.
3. Em `src/config/app.config.js`: `AUTH.provider = 'supabase'`, preencha `url` e `anonKey`
   (Project Settings → API).
4. `npm run build`.

Tabelas: languages, levels, units, lessons, exercises, exercise_options, profiles,
user_languages, user_progress, lesson_progress, streaks. RLS ativo: conteúdo é leitura,
progresso só do dono. A conclusão de aula passa pela função `complete_lesson`, que também
valida Free × Plus no servidor (o usuário não consegue se dar Plus).

## Prompt 3 · Aula e comportamento do Zuno

### Zuno com personalidade (`src/zuno/`)
- `brain.js` (ZunoBrain): decide a reação olhando personalidade, acertos/erros seguidos,
  erro repetido na mesma pergunta, tempo parado (25 s curioso, 60 s sonolento/impaciente),
  Modo Difícil, dias de ausência e se o usuário é iniciante. Ele fica quieto na maior parte do tempo.
- Erro em etapas: olha a resposta → pausa → olha para você → muda a expressão → fala → a tela ensina.
- 11 estados emocionais em `zuno.states.js` (normal, feliz, curioso, confuso, surpreso, orgulhoso,
  sonolento, triste, irritado, provocador, malicioso). Artes oficiais: neutra, feliz e provocadora;
  os outros estados usam a arte mais próxima + postura própria até chegarem artes novas.
- Falas em `lines/` (Light, Provocador, Ofensivo) nos 9 idiomas: o Zuno fala no idioma estudado
  com a tradução em português embaixo. Sem repetir as últimas falas.
- Risada: leve, travessa e exagerada, com frequência controlada. Os áudios ainda não existem:
  preencher `src` em `services/audio/AudioService.js` (enquanto isso, só animação + texto acessível).

### Personalidades (Perfil)
Uma ativa por vez, salva por usuário. Light e Provocador no Free; Ofensivo é Plus e exige confirmação.

### Atividades (`components/exercises/`)
Múltipla escolha, complete a frase, verdadeiro ou falso, escutar e responder (voz do próprio
aparelho; sem voz, mostra o texto), leitura, identificação de frase, ordenar palavras, associação,
escrita, tradução digitada, resposta aberta (IA ainda não configurada: confere palavras-chave e mostra
exemplo), identificação de palavra e revisão (sessão com os erros guardados, `#revisao-en`).

### Feedback, conclusão e revisão
Correto/Incorreto, "Você respondeu", "Correto", tradução e explicação. Conclusão com XP, acertos,
erros e palavras novas, "Continuar"/"Voltar" e "Vamos revisar isso?". Erros ficam guardados.

### ⚡ Modo Difícil (`domain/hardMode.js`)
Menos dicas e tradução, mais escrita, tradução digitada e listening, frases com palavras extras, +50% XP.
Free: Aula 01 de cada idioma. Plus: completo. Ativar na página do idioma.

### Acessibilidade
"Reduzir animações" no Perfil (além da preferência do sistema). Tudo que o Zuno diz vai para
leitores de tela, incluindo a risada.

### Integrações (não configuradas, sem fingir)
`config/integrations.js`: IA, voz própria do Zuno e reconhecimento de fala ficam atrás de um backend
próprio. O app só conhece o endereço público via variável de ambiente:
`ZUNO_API_BASE=https://api.seudominio.com npm run build`. Nenhuma chave vai para o frontend.

### Banco
`supabase/schema.sql` ganhou: colunas de preferências e estado do Zuno em `profiles`,
`exercises.data` (dados de cada tipo), `lesson_answers`, `user_mistakes` e as funções
`set_preferences` (bloqueia Ofensivo sem Plus) e `record_answers`. Rodar o arquivo de novo é seguro.

## Prompt 4 · IA do Zuno, conversa e Modo Mundo

### Camada de IA (`src/services/ai/`)
- `AIService.js`: única porta para a IA. Tarefas: `converse` (Conversar com Zuno e Modo Mundo),
  `correct` (Escreva em outro idioma) e `explain` (tradução com contexto). Normaliza toda resposta.
- `prompts.js`: o Zuno como PROFESSOR com personalidade (Light, Provocador, Ofensivo), estrutura
  reação → correção → resposta → explicação → nova tentativa, erro importante × erro pequeno,
  "saber ficar quieto", surpresa, uma palavra nova por vez, nível e dificuldade adaptativa.
  O mesmo arquivo roda no servidor (`npm run functions` copia para `supabase/functions/_shared`).
- `learnerContext.js`: idioma, nível, unidade, palavras estudadas, erros recentes, aulas e objetivo,
  tudo do progresso real.
- `SessionStore.js`: memória da sessão (resumo, palavras, erros, últimas falas) e "Conversas recentes".
- `UsageService.js`: medidor de uso. Os limites reais ficam no servidor (`ai_limits`).

### De onde vem a IA (sem fingir)
1. **Servidor próprio** (produção): `ZUNO_API_BASE=https://<projeto>.supabase.co/functions/v1/zuno-ai npm run build`.
   A chave fica só no servidor (`supabase secrets set ANTHROPIC_API_KEY=... ZUNO_AI_MODEL=...`).
   O servidor valida plano, aplica limites (`ai_consume`) e monta os prompts.
2. **Página publicada no Claude**: a página pede respostas ao Claude da própria pessoa (capacidade `sample`).
   É IA real; a pessoa autoriza na primeira mensagem e o uso sai da conta Claude dela.
   Aqui os limites são contados só no aparelho.
3. **Nenhuma**: a tela diz "A IA do Zuno ainda não está conectada". Nada é inventado.
Há um provedor de DEMONSTRAÇÃO (`providers/demo.provider.js`) que só liga nos testes automatizados
e sempre mostra o selo "Demonstração".

### Telas
- `#mundo` 🌎 Modo Mundo: idioma, 14 situações (Free: Cafeteria, Aeroporto, Restaurante), ferramentas e
  Conversas recentes.
- `#cena-fr-cafeteria`: introdução (🇫🇷 FRANÇA · ☕ Cafeteria · "Você acabou de entrar…"), o Zuno diz
  "Bonjour ! Prêt ?", e a IA conduz a cena com objetivo e vocabulário que surge naturalmente.
- `#conversar` → `#conversa-en-a1-viagem`: escolher idioma, nível, tema e objetivo.
- `#escrever`: "Você escreveu / Forma natural / Por quê / Como um nativo diria" + tradução com contexto.
- `#pronuncia-en`: Zuno fala → ouvir → Praticar (grava de verdade) → análise (só com servidor de fala).
- `#sessao-<id>`: retomar uma conversa.

### Zuno na conversa
Fica à esquerda (no celular, numa faixa fixa que não cobre mensagens nem a caixa de resposta).
A IA sugere a emoção; a personalidade muda como ela aparece (`presentEmotion`). Surpresa usa o
recorte surpreso (`assets/zuno-surprised.webp`): cresce um pouco e volta ao estado anterior.

### Voz
`services/voice/VoiceService.js`: 🔊 ouvir · 🔁 repetir · 🐢 devagar em 9 idiomas. Usa a voz própria do Zuno
se o servidor tiver `TTS_API_URL`; senão, a voz do aparelho; senão, os botões somem.
Perfil de voz por personalidade (calma, brincalhona, teatral). Sons de risada/surpresa/comemoração/sono/
frustração por personalidade em `AudioService.js` (`src: null` até os áudios chegarem).

### Banco (rodar `supabase/schema.sql` de novo é seguro)
Novas tabelas: `ai_limits` (limites configuráveis), `ai_usage`, `chat_sessions`, `chat_messages`;
funções `ai_consume` e `ai_usage_today`; `profiles.goal`.

## Prompt 5 · Versão final

**Primeira tela continua sendo o login.** Depois do cadastro, o app leva para `#comecar` e só libera o resto quando o quiz termina (guarda em `main.js`, campo `onboarded` no progresso). Dá para sair do quiz pelo botão "Sair".

### Quiz e teste de nível (`domain/placement.js`, `pages/app/OnboardingPage.js`)
1. Um idioma só (dá para adicionar outros depois em "Adicionar idioma").
2. Autoavaliação (nunca estudei / básico / me viro / avançado). Ela só define a primeira pergunta.
3. Teste adaptativo (escada): acertou → sobe de nível, errou ou "Não sei" → desce. Perguntas vêm do próprio curso.
4. Resultado: idioma, nível estimado (Iniciante A1/A2, Intermediário B1/B2, Avançado C2), pontos fortes, o que precisa de prática e "Começar com Zuno".
O nível **não pula o ensino**: níveis abaixo ficam liberados e viram "Revisão rápida", e as lacunas aparecem como "Recomendado para você" e vão para a IA (`learnerContext.placementGaps`). Refazer o teste: `#nivel-xx`.

### Curso: A1, A2, B1, B2, C2 (sem C1)
- `content/curriculum/levels.js`: nomes dos níveis (Fundamentos, Construindo fluência, Comunicação intermediária, Conversação avançada, Domínio avançado).
- `content/curriculum/bank.js`: banco multilíngue por unidade (`pt|en|es|it|fr|de|ja|ko|zh`, com leitura `texto|leitura`), gramática e habilidades. Japonês tem Hiragana, Katakana, Partículas, Kanji e Formalidade (`JAPANESE_EXTRA`).
- `content/curriculum/generator.js`: cada unidade vira aulas no método **ensino → exemplo → escuta → tentativa → correção → repetição → aplicação**: cartão de ensino, PT → idioma, idioma → PT, escuta, "Agora você" (fala), ordenar frase, escrever e uma aula de revisão. ~88 aulas e ~840 atividades por idioma (japonês 104 aulas).
- As aulas originais dos prompts 2–4 continuam como unidade "Frases essenciais" (IDs preservados).
- Para crescer: adicione linhas/unidades no banco; nada mais muda.

### Free / Plus (`config/plans.js`)
- Plus: **R$ 19,90/mês** (`PLUS_PRICE`, configurável). Pagamento ainda **não integrado** (o botão diz isso).
- Free: A1 com 4 unidades, A2 com 1 unidade, a 1ª aula de B1/B2/C2, parte do Modo Difícil e do Modo Mundo, Light e Provocador, 3 frases de pronúncia, limites de IA menores (`ai.config.js`, definidos de verdade no servidor).

### Voz
- `VoiceService`: voz do servidor (`/tts` na função `zuno-ai`, segredos `TTS_API_URL/TTS_API_KEY`) quando existir; senão a voz do aparelho (Web Speech); senão os botões somem. Velocidade normal/devagar, voz por personalidade (Light calma, Provocador brincalhona, Ofensivo teatral).
- O Zuno fala as reações ("Very good!" + "Muito bem!" embaixo). Desliga em Perfil → "O Zuno fala em voz alta".
- Pronúncia: gravação real (MediaRecorder). A análise só aparece se o servidor de fala estiver configurado (`STT_API_URL/KEY`).
- Sons (risada, surpresa, comemoração, sono, frustração): estrutura pronta em `services/audio/AudioService.js` com `src: null`. Coloque os arquivos e eles passam a tocar.

### Sono, volta e estados
- Estados: normal, feliz, curioso, confuso, surpreso, orgulhoso, sonolento, dormindo, frustrado, provocador, malicioso (`zuno/zuno.states.js`). Arte de "dormindo" é o recorte enviado (`assets/zuno-sleeping.webp`).
- Sem estudar há 3+ dias o Zuno aparece dormindo na Home e acorda aos poucos (dormindo → "…hm?" → surpreso → feliz) com a frase da ausência (`zuno/lines/absence.js`: 3 dias "Você sumiu.", 7 dias "Olha quem resolveu aparecer.", mais "Eu já estava criando raízes.").

### Evolução (`zuno/evolution.js`)
Estágios por XP (Curioso, Explorador, Viajante, Poliglota, Mestre) e itens desbloqueados por progresso: poses, giro, brilho, aura, estrela, bandeira do idioma, livro, chama, coroa (Plus)… Eles **orbitam** o Zuno, nunca mudam o desenho. Equipar em Perfil → "Evolução do Zuno".

### Layout desktop
`styles/final.css`: a partir de 768px o conteúdo fica num container centralizado à direita da barra lateral (`width: min(100% - 2×margem, 960px)`, 1040px em telas ≥1600px, `margin-inline: auto`). Mobile não mudou.

### Desempenho
As artes do Zuno agora são arquivos separados (`dist/assets/*.webp`) e só carregam quando o estado aparece (`preloadZunoArt`). Ao publicar, envie a pasta `dist/assets` junto com o HTML.

### Banco (Supabase)
`schema.sql` (seção Prompt 5): `user_languages.placement`, `profiles.onboarded/voice/evolution_*`, `units.skills/grammar`, `lessons.is_review`, tabela `plans` e RPC `save_placement`. `npm run seed` regera `seed.sql` com o curso inteiro.

## Refinamento visual (pós Prompt 5)
- Paleta fixa clara: fundo `#f7f6f1`, cards brancos, texto `#171c1a` / `#66706b`. O verde do Zuno virou destaque (botão principal, progresso, pequenos sinais). Seleções usam verde suave (`--brand-soft` + `--brand-line`). O tema escuro só liga com `data-theme="dark"`.
- Aula: container `min(100% - 2×margem, 1100px)`, um card branco grande, topo com idioma → UNIDADE · AULA → título → palavras da aula (discretas) → barra fina + "Atividade X de Y".
- Zuno flutua sobre o canto superior esquerdo do card, com faixa/coluna reservada: nunca cobre texto nem botão (checado em 340–1920 px). Celular: balão ao lado dele; computador: balão embaixo.
- Estatísticas em cards brancos com número grande; Zuno do Perfil muda com o progresso.
- Tudo em `src/styles/refine.css` (carregado por último) e no topo da aula em `LessonPage.js`.
