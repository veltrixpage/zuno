/**
 * Sessões de conversa (Conversar com Zuno e Modo Mundo).
 * Guarda a memória da sessão (resumo, palavras, erros, últimas falas) para o
 * Zuno não "começar do zero" a cada mensagem, e alimenta "Conversas recentes".
 * Local por usuário; com Supabase, também vai para chat_sessions/chat_messages.
 */
import { local } from '../../core/storage.js';
import { sync } from '../progress/sync/index.js';

const key = (userId) => `ai.sessions.${userId}`;
const MAX_SESSIONS = 30;
const MAX_TURNS = 80;

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)).replace(/[^a-z0-9]/gi, '').slice(0, 16).toLowerCase();

export const SessionStore = {
  /** Conversas com pelo menos uma fala (as abertas e não usadas não aparecem). */
  recent(userId, n = 6) {
    return this.list(userId).filter((s) => s.turns.some((t) => t.role === 'user' || t.role === 'zuno')).slice(0, n);
  },

  list(userId) {
    return local.get(key(userId), []).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  get(userId, id) {
    return this.list(userId).find((s) => s.id === id) || null;
  },

  create(userId, { kind, code, level, topic = null, situation = null }) {
    const s = {
      id: newId(), kind, code, level, topic, situation,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      turns: [], summary: null, words: [], errors: [], difficulty: 0, goodStreak: 0, badStreak: 0, goalDone: false,
    };
    // Remove sessões abertas e nunca usadas, para não acumular.
    local.set(key(userId), local.get(key(userId), []).filter((x) => x.turns.length > 0));
    this.save(userId, s);
    return s;
  },

  save(userId, s) {
    s.updatedAt = new Date().toISOString();
    s.turns = s.turns.slice(-MAX_TURNS);
    const all = local.get(key(userId), []).filter((x) => x.id !== s.id);
    local.set(key(userId), [s, ...all].slice(0, MAX_SESSIONS));
    sync.push('ai_session_saved', { userId, session: { ...s, turns: s.turns.slice(-2) } });
    return s;
  },

  /** Memória enviada à IA a cada mensagem. */
  memory(s) {
    return {
      summary: s.summary,
      words: s.words,
      errors: s.errors,
      history: s.turns.filter((t) => t.role === 'user' || t.role === 'zuno').map((t) => ({ role: t.role, text: t.text })).slice(-12),
    };
  },
};

/** "Hoje", "Ontem" ou a data curta. */
export function relativeDay(iso) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.round((new Date(today.toDateString()) - new Date(d.toDateString())) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}
