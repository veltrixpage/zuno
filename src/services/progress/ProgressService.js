/**
 * Progresso individual por usuário (local-first + sincronização).
 *
 * Os dados ficam salvos por usuário neste dispositivo e, quando o Supabase
 * estiver configurado, cada evento também é enviado ao banco (ver sync/).
 * Nada aqui é número decorativo: tudo é calculado a partir das aulas concluídas.
 *
 * Formato (v2), espelhando as tabelas:
 * {
 *   version: 2,
 *   languages: { [code]: { code, level, startedAt, lastActivityAt } }        // user_languages
 *   lessons:   { [lessonId]: { status, correct, total, xp, seconds,
 *                              attempts, completedAt, updatedAt } }           // lesson_progress
 *   stats: { xp, seconds, words: { [code]: string[] } }                       // user_progress
 *   streak: { current, longest, lastStudyDay }                                // streaks
 *   mistakes: { [exerciseId]: { lessonId, code, count, lastGiven, lastAt, resolved } } // user_mistakes
 *   zuno: { state, at }                                                       // estado recente do Zuno
 *   lastLanguage: code | null, lastActivityAt: ISO | null
 * }
 * Cada aula guarda também as respostas da última tentativa (lessons[id].answers).
 */
import { local } from '../../core/storage.js';
import { sync } from './sync/index.js';
import { newlyUnlocked } from '../../zuno/evolution.js';

const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 4.5, C2: 5 };

const key = (userId) => `progress.${userId}`;
const MAX_LESSON_SECONDS = 30 * 60; // evita contar tempo parado

const empty = () => ({
  version: 2,
  languages: {},
  lessons: {},
  stats: { xp: 0, seconds: 0, words: {} },
  streak: { current: 0, longest: 0, lastStudyDay: null },
  mistakes: {},
  zuno: { state: 'neutral', at: null, wokeAt: null },
  evolution: { unlocked: [], equipped: [] },
  onboarded: false,
  lastLanguage: null,
  lastActivityAt: null,
});

const now = () => new Date().toISOString();
const localDay = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
const dayDiff = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

/** Converte o formato do Prompt 1 (v1) sem perder nada. */
function migrate(raw) {
  if (!raw || raw.version === 2) {
    const base = empty();
    const merged = { ...base, ...(raw || {}), mistakes: raw?.mistakes || {}, zuno: raw?.zuno || base.zuno, evolution: raw?.evolution || base.evolution };
    // Quem já estudava antes do quiz (Prompts 1–4) não precisa refazer o começo.
    if (raw && raw.onboarded === undefined) merged.onboarded = Object.keys(raw.languages || {}).length > 0;
    return merged;
  }
  const p = empty();
  for (const [code, l] of Object.entries(raw.languages || {})) {
    p.languages[code] = { code, level: 'A1', startedAt: l.startedAt || now(), lastActivityAt: l.lastStudiedAt || l.startedAt || now() };
    p.stats.xp += l.xp || 0;
    p.stats.seconds += (l.minutes || 0) * 60;
  }
  p.lastLanguage = raw.activeLanguage || null;
  p.onboarded = Object.keys(p.languages).length > 0;
  p.streak.current = raw.streak || 0;
  p.streak.longest = raw.streak || 0;
  p.streak.lastStudyDay = raw.lastStudyDay || null;
  return p;
}

export const ProgressService = {
  load(userId) {
    const p = migrate(local.get(key(userId), null));
    // A sequência zera se passou mais de um dia sem estudar.
    if (p.streak.lastStudyDay && dayDiff(p.streak.lastStudyDay, localDay()) > 1) p.streak.current = 0;
    return p;
  },

  save(userId, p) {
    local.set(key(userId), p);
    return p;
  },

  /** Adiciona o idioma em "Seus idiomas" (user_languages). */
  addLanguage(userId, code) {
    const p = this.load(userId);
    if (!p.languages[code]) {
      p.languages[code] = { code, level: 'A1', startedAt: now(), lastActivityAt: now() };
      sync.push('language_added', { userId, code, level: 'A1' });
    }
    p.lastLanguage = code;
    return this.save(userId, p);
  },

  hasLanguage(userId, code) {
    return Boolean(this.load(userId).languages[code]);
  },

  /**
   * Conclusão de aula. Calcula XP, palavras, tempo e sequência.
   * @returns {{ xpEarned:number, newWords:string[], streak:number, firstTime:boolean }}
   */
  completeLesson(userId, { code, cefr, lesson }, { correct, total, seconds, answers = [], hard = false, plan = 'free' }) {
    const p = this.load(userId);
    if (!p.languages[code]) p.languages[code] = { code, level: cefr, startedAt: now(), lastActivityAt: now() };

    const prev = p.lessons[lesson.id];
    const firstTime = prev?.status !== 'completed';
    const secs = Math.max(0, Math.min(MAX_LESSON_SECONDS, Math.round(seconds)));
    // XP: 2 por acerto de primeira + bônus da aula na primeira conclusão.
    const base = correct * 2 + (firstTime ? lesson.xp : 0);
    const xpEarned = hard ? Math.round(base * 1.5) + (prev?.hardCompleted ? 0 : 5) : base;

    p.lessons[lesson.id] = {
      status: 'completed',
      correct,
      total,
      xp: (prev?.xp || 0) + xpEarned,
      seconds: (prev?.seconds || 0) + secs,
      attempts: (prev?.attempts || 0) + 1,
      wrong: answers.filter((a) => !a.correct).length,
      hardCompleted: Boolean(prev?.hardCompleted || hard),
      answers: answers.slice(-60),
      completedAt: prev?.completedAt || now(),
      updatedAt: now(),
    };
    registerMistakes(p, code, lesson.id, answers);

    const known = new Set(p.stats.words[code] || []);
    const newWords = lesson.words.filter((w) => !known.has(w));
    p.stats.words[code] = [...known, ...newWords];
    p.stats.xp += xpEarned;
    p.stats.seconds += secs;

    const today = localDay();
    if (p.streak.lastStudyDay !== today) {
      const consecutive = p.streak.lastStudyDay && dayDiff(p.streak.lastStudyDay, today) === 1;
      p.streak.current = consecutive ? p.streak.current + 1 : 1;
      p.streak.lastStudyDay = today;
      p.streak.longest = Math.max(p.streak.longest, p.streak.current);
    }

    p.languages[code].lastActivityAt = now();
    // Avançou para um nível acima? O nível do idioma acompanha.
    if ((LEVEL_ORDER[cefr] || 0) > (LEVEL_ORDER[p.languages[code].level] || 0)) p.languages[code].level = cefr;
    p.lastLanguage = code;
    p.lastActivityAt = now();
    const unlocked = newlyUnlocked(p, plan);
    if (unlocked.length) {
      p.evolution.unlocked = [...p.evolution.unlocked, ...unlocked.map((i) => i.id)];
      p.evolution.equipped = [...new Set([...p.evolution.equipped, ...unlocked.map((i) => i.id)])];
    }
    this.save(userId, p);

    sync.push('lesson_completed', { userId, code, lessonId: lesson.id, correct, total, seconds: secs, xpEarned, words: newWords, answers, hard });
    if (unlocked.length) sync.push('evolution_unlocked', { userId, items: unlocked.map((i) => i.id) });
    return { xpEarned, newWords, streak: p.streak.current, firstTime, unlocked };
  },

  /** Resultado do quiz inicial / teste de nível. Não pula o ensino: define o ponto de partida. */
  savePlacement(userId, code, placement) {
    const p = this.load(userId);
    const existing = p.languages[code];
    p.languages[code] = {
      code,
      level: placement.estimated,
      startedAt: existing?.startedAt || now(),
      lastActivityAt: now(),
      placement: { ...placement, at: now() },
    };
    p.lastLanguage = code;
    p.onboarded = true;
    this.save(userId, p);
    sync.push('placement_saved', { userId, code, placement });
    return p;
  },

  toggleEquip(userId, itemId) {
    const p = this.load(userId);
    const eq = new Set(p.evolution.equipped);
    if (eq.has(itemId)) eq.delete(itemId); else if (p.evolution.unlocked.includes(itemId)) eq.add(itemId);
    p.evolution.equipped = [...eq];
    return this.save(userId, p);
  },

  markWoke(userId) {
    const p = this.load(userId);
    p.zuno = { ...p.zuno, wokeAt: localDay() };
    this.save(userId, p);
  },

  /** Sessão de revisão: acertos resolvem os erros guardados. */
  completeReview(userId, code, { answers, seconds }) {
    const p = this.load(userId);
    const secs = Math.max(0, Math.min(MAX_LESSON_SECONDS, Math.round(seconds)));
    const firstTry = new Map();
    for (const a of answers) if (!firstTry.has(a.exerciseId)) firstTry.set(a.exerciseId, a.correct);
    let resolved = 0;
    for (const [id, ok] of firstTry) {
      const m = p.mistakes[id];
      if (m && ok) { m.resolved = true; m.resolvedAt = now(); resolved += 1; }
    }
    registerMistakes(p, code, null, answers);
    const xpEarned = resolved * 2;
    p.stats.xp += xpEarned;
    p.stats.seconds += secs;
    p.lastActivityAt = now();
    this.save(userId, p);
    sync.push('review_completed', { userId, code, answers, seconds: secs, xpEarned });
    return { xpEarned, resolved };
  },

  /** Erros ainda não revisados de um idioma (mais frequentes primeiro). */
  pendingMistakes(p, code) {
    return Object.entries(p.mistakes)
      .filter(([, m]) => !m.resolved && (!code || m.code === code))
      .sort((a, b) => b[1].count - a[1].count)
      .map(([exerciseId, m]) => ({ exerciseId, ...m }));
  },

  /** Último estado do Zuno (usado na Home: sonolento, surpreso...). */
  setZunoState(userId, state) {
    const p = this.load(userId);
    p.zuno = { state, at: now() };
    this.save(userId, p);
    sync.push('zuno_state', { userId, state });
  },

  /** Dias desde o último estudo (null se nunca estudou). */
  daysAway(p) {
    if (!p.streak.lastStudyDay) return null;
    return Math.max(0, dayDiff(p.streak.lastStudyDay, localDay()));
  },

  totals(p, code = null) {
    const lessons = Object.entries(p.lessons).filter(([id, l]) => l.status === 'completed' && (!code || id.startsWith(`${code}-`)));
    const words = code ? (p.stats.words[code] || []).length : Object.values(p.stats.words).reduce((s, w) => s + w.length, 0);
    return {
      mistakes: Object.values(p.mistakes).filter((m) => !m.resolved && (!code || m.code === code)).length,
      streak: p.streak.current,
      longestStreak: p.streak.longest,
      xp: code ? lessons.reduce((s, [, l]) => s + l.xp, 0) : p.stats.xp,
      words,
      lessonsCompleted: lessons.length,
      seconds: code ? lessons.reduce((s, [, l]) => s + l.seconds, 0) : p.stats.seconds,
    };
  },

  /** Idiomas do usuário, do mais recente para o mais antigo. */
  languagesByRecent(p) {
    return Object.values(p.languages).sort((a, b) => Date.parse(b.lastActivityAt) - Date.parse(a.lastActivityAt));
  },
};

function registerMistakes(p, code, lessonId, answers) {
  for (const a of answers) {
    if (a.correct) continue;
    const m = p.mistakes[a.exerciseId] || { lessonId: lessonId || a.lessonId || null, code, count: 0 };
    m.count += 1;
    m.lastGiven = a.given;
    m.lastAt = a.at || now();
    m.resolved = false;
    p.mistakes[a.exerciseId] = m;
  }
}

/** "12 min", "1,5 h", "< 1 min" */
export function formatDuration(seconds) {
  if (!seconds) return { value: '0', unit: 'min' };
  if (seconds < 60) return { value: '< 1', unit: 'min' };
  const m = Math.round(seconds / 60);
  if (m < 60) return { value: String(m), unit: 'min' };
  return { value: (m / 60).toFixed(1).replace('.', ','), unit: 'h' };
}
