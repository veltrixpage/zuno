/**
 * Personalidades do Zuno e escolha de falas.
 *
 * Só UMA personalidade fica ativa por usuário (SettingsService).
 *   light       → Free · gentil, paciente, professor
 *   provocador  → Free · zoeira divertida
 *   ofensivo    → Plus · humor teatral e agressivo, exige escolha consciente
 *
 * Eventos de fala: correct, proud, comeback, wrong1, wrong2, wrong3, wrong_same,
 *                  idle, return, hard_start, complete
 */
import light from './lines/light.js';
import provocador from './lines/provocador.js';
import ofensivo from './lines/ofensivo.js';

export const PERSONALITIES = {
  light: {
    id: 'light', label: 'Light', tier: 'free', laugh: 'soft',
    description: 'Gentil e paciente. Explica sem pressa e nunca constrange.',
    lines: light,
  },
  provocador: {
    id: 'provocador', label: 'Provocador', tier: 'free', laugh: 'mischievous',
    description: 'Zoa os seus erros, ri da sua cara e depois ensina do mesmo jeito.',
    lines: provocador,
  },
  ofensivo: {
    id: 'ofensivo', label: 'Ofensivo', tier: 'plus', laugh: 'big', requiresConsent: true,
    description: 'Teatral e exagerado. Chama você de burro, besta, jumento. Só para quem aguenta.',
    lines: ofensivo,
  },
};

export const getPersonality = (id) => PERSONALITIES[id] || PERSONALITIES.light;

const recent = new Map(); // evita repetir as últimas falas de cada evento

/**
 * Escolhe uma fala sem repetir as últimas duas.
 * avoidLaugh: quando true, prefere falas sem risada (controle de frequência).
 */
export function pickLine(personalityId, event, { avoidLaugh = false } = {}) {
  const p = getPersonality(personalityId);
  let pool = p.lines[event]?.length ? p.lines[event] : PERSONALITIES.light.lines[event] || [];
  if (!pool.length) return null;
  if (avoidLaugh && pool.some((l) => !l.laugh)) pool = pool.filter((l) => !l.laugh);

  const key = `${p.id}:${event}`;
  const last = recent.get(key) || [];
  const fresh = pool.filter((l) => !last.includes(l));
  const options = fresh.length ? fresh : pool;
  const line = options[Math.floor(Math.random() * options.length)];
  recent.set(key, [line, ...last].slice(0, Math.min(2, pool.length - 1)));
  return line;
}

/** Texto da fala no idioma estudado + tradução em português. */
export function renderLine(line, langCode) {
  if (!line) return { text: '', translation: null };
  const target = line.text[langCode] || line.text.pt;
  const translation = langCode !== 'pt' && line.text[langCode] ? line.text.pt : null;
  return { text: target, translation };
}
