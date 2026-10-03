/**
 * AIService: a ÚNICA porta de entrada para a IA no app.
 * Nenhum componente chama uma API de IA diretamente.
 *
 * Tarefas: converse (Conversar com Zuno + Modo Mundo) · correct (Escreva em
 * outro idioma) · explain (tradução com contexto).
 *
 * Provedor escolhido nesta ordem:
 *   1. backend  → ZUNO_API_BASE definido no build e o servidor diz ai: true
 *   2. claude   → página aberta como página publicada no Claude
 *   3. nenhum   → a tela mostra que a IA precisa ser configurada (sem fingir)
 * (demo só existe nos testes automatizados, com selo "Demonstração")
 */
import { createBackendProvider } from './providers/backend.provider.js';
import { createClaudePageProvider } from './providers/claudePage.provider.js';
import { createDemoProvider } from './providers/demo.provider.js';
import { backendStatus } from './backendStatus.js';
import { AIError } from './AIError.js';
import { UsageService } from './UsageService.js';
import { TASK_FEATURE } from './prompts.js';
import { AI_EMOTIONS } from '../../zuno/zuno.states.js';

let providerPromise = null;

async function pickProvider() {
  if (globalThis.__ZUNO_TEST__) return createDemoProvider();
  const status = await backendStatus();
  if (status.ai) {
    if (status.limits) UsageService.setServerLimits(status.limits);
    return createBackendProvider();
  }
  const claude = createClaudePageProvider();
  if (await claude.available()) return claude;
  return null;
}

const provider = () => (providerPromise ||= pickProvider());

/* ---------------- normalização (nunca confiar no formato) ---------------- */
const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const bubble = (v) => (v && str(v.text) ? { text: str(v.text), translation: str(v.translation) } : null);
const laugh = (v) => (['soft', 'mischievous', 'big'].includes(v) ? v : null);
const emotion = (v) => (AI_EMOTIONS.includes(v) ? v : 'neutral');

function normalizeConverse(r = {}) {
  const c = r.correction && str(r.correction.natural) ? {
    severity: r.correction.severity === 'minor' ? 'minor' : 'major',
    you_wrote: str(r.correction.you_wrote),
    natural: str(r.correction.natural),
    why: str(r.correction.why),
    native: str(r.correction.native),
  } : null;
  const t = r.teach && str(r.teach.term) ? {
    term: str(r.teach.term), translation: str(r.teach.translation), reading: str(r.teach.reading),
    example: str(r.teach.example), example_translation: str(r.teach.example_translation), note: str(r.teach.note),
  } : null;
  return {
    demo: Boolean(r.demo),
    reaction: bubble(r.reaction),
    correction: c,
    reply: bubble(r.reply) || { text: '…', translation: null },
    teach: t,
    emotion: emotion(r.emotion),
    laugh: laugh(r.laugh),
    surprise: r.surprise === true,
    difficulty: ['easier', 'same', 'harder'].includes(r.difficulty) ? r.difficulty : 'same',
    newWords: Array.isArray(r.new_words) ? r.new_words.map(str).filter(Boolean).slice(0, 5) : [],
    summary: str(r.summary),
    goalDone: r.goal_done === true,
  };
}

function normalizeCorrect(r = {}) {
  return {
    demo: Boolean(r.demo),
    isCorrect: r.is_correct === true,
    youWrote: str(r.you_wrote),
    natural: str(r.natural),
    native: str(r.native),
    translation: str(r.translation),
    why: str(r.why),
    notes: Array.isArray(r.notes) ? r.notes.filter((n) => n && str(n.to)).map((n) => ({ from: str(n.from), to: str(n.to), why: str(n.why) })).slice(0, 6) : [],
    reaction: bubble(r.reaction),
    emotion: emotion(r.emotion),
    laugh: laugh(r.laugh),
  };
}

function normalizeExplain(r = {}) {
  return {
    demo: Boolean(r.demo), term: str(r.term), translation: str(r.translation), literal: str(r.literal), reading: str(r.reading),
    note: str(r.note), example: str(r.example), exampleTranslation: str(r.example_translation),
  };
}

const NORMALIZE = { converse: normalizeConverse, correct: normalizeCorrect, explain: normalizeExplain };

export const AIService = {
  /** { ready, provider, label } — usado pelas telas para mostrar o estado real. */
  async status() {
    const p = await provider();
    return p ? { ready: true, provider: p.id, label: p.label } : { ready: false, provider: null, label: 'Não configurada' };
  },

  /**
   * Executa uma tarefa. `feature` define a cota (chat, world, correct).
   * Lança AIError com mensagem pronta para a tela.
   */
  async run(task, context, { user, signal, feature } = {}) {
    const p = await provider();
    if (!p) throw new AIError('not_configured');
    const f = feature || TASK_FEATURE[task];
    // Com backend, o servidor decide; aqui só evitamos uma chamada que já sabemos que vai falhar.
    if (p.id !== 'backend' && user && !UsageService.canUse(user, f)) throw new AIError('limit');

    const { result, usage } = await p.run(task, context, { signal });
    if (user) UsageService.record(user.id, f, usage);
    return { ...NORMALIZE[task](result || {}), provider: p.id };
  },

  converse(context, opts) { return this.run('converse', context, { ...opts, feature: context.mode === 'world' ? 'world' : 'chat' }); },
  correct(context, opts) { return this.run('correct', context, opts); },
  explain(context, opts) { return this.run('explain', context, opts); },
};
