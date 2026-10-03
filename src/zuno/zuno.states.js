/**
 * Estados emocionais do Zuno.
 *
 * Artes oficiais (recortes enviados):
 *   neutral  → Prompt 1     happy → Prompt 2     provoke → Prompt 3     surprised → Prompt 4     sleeping → Prompt 5
 *
 * Cada estado = arte + postura (CSS, ver styles/zuno.css) + ritmo de flutuação.
 * Estados que ainda não têm arte própria reaproveitam a mais próxima e se
 * diferenciam pela postura. Quando chegarem novas artes, basta trocar `art`.
 *
 * Regra de identidade: nunca redesenhar, sem pernas/pés, sempre flutuando.
 */
import zunoNeutral from '../assets/zuno.webp';
import zunoHappy from '../assets/zuno-happy.webp';
import zunoProvoke from '../assets/zuno-provoke.webp';
import zunoSurprised from '../assets/zuno-surprised.webp';
import zunoSleeping from '../assets/zuno-sleeping.webp';

export const ZUNO_ART = {
  neutral: zunoNeutral,
  happy: zunoHappy,
  provoke: zunoProvoke,
  surprised: zunoSurprised,
  sleeping: zunoSleeping,
};

export const ZUNO_STATES = {
  neutral:     { art: 'neutral', float: 'calm',   label: 'Zuno',              mood: 'normal' },
  happy:       { art: 'happy',   float: 'lively', label: 'Zuno feliz',        mood: 'feliz' },
  curious:     { art: 'neutral', float: 'calm',   label: 'Zuno curioso',      mood: 'curioso' },
  confused:    { art: 'neutral', float: 'slow',   label: 'Zuno confuso',      mood: 'confuso' },
  surprised:   { art: 'surprised', float: 'lively', label: 'Zuno surpreso',   mood: 'surpreso' },
  frustrated:  { art: 'neutral', float: 'slow',   label: 'Zuno frustrado',    mood: 'frustrado' },
  proud:       { art: 'happy',   float: 'lively', label: 'Zuno orgulhoso',    mood: 'orgulhoso' },
  sleepy:      { art: 'neutral', float: 'sleepy', label: 'Zuno sonolento',    mood: 'sonolento' },
  sleeping:    { art: 'sleeping', float: 'sleepy', label: 'Zuno dormindo',    mood: 'dormindo' },
  sad:         { art: 'neutral', float: 'slow',   label: 'Zuno triste',       mood: 'triste' },
  irritated:   { art: 'provoke', float: 'calm',   label: 'Zuno irritado',     mood: 'irritado' },
  provocative: { art: 'provoke', float: 'calm',   label: 'Zuno provocador',   mood: 'provocador' },
  mischievous: { art: 'provoke', float: 'lively', label: 'Zuno malicioso',    mood: 'malicioso' },
  // nomes antigos (Prompt 2) continuam funcionando
  wrong:       { art: 'neutral', float: 'slow',   label: 'Zuno pensativo',    mood: 'confuso' },
  thinking:    { art: 'neutral', float: 'slow',   label: 'Zuno pensando',     mood: 'curioso' },
};

/** Estágios de evolução. Desligado em FEATURES.zunoEvolution. */
export const ZUNO_EVOLUTION = [{ stage: 1, label: 'Zuno', art: 'neutral' }];

export const resolveZunoArt = (state = 'neutral') => {
  const s = ZUNO_STATES[state] || ZUNO_STATES.neutral;
  return ZUNO_ART[s.art] || ZUNO_ART.neutral;
};

/**
 * Pré-carrega só o necessário. Cada arte é um arquivo separado e otimizado;
 * as outras carregam quando o estado aparece pela primeira vez.
 */
const loaded = new Set();
export function preloadZunoArt(states = ['neutral', 'happy']) {
  for (const st of states) {
    const src = resolveZunoArt(st);
    if (loaded.has(src)) continue;
    loaded.add(src);
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  }
}

/**
 * Emoções que a IA pode sugerir. Qualquer outra vira 'neutral'.
 * A personalidade muda COMO a emoção aparece (ex.: o Provocador mostra
 * confusão com cara de deboche).
 */
export const AI_EMOTIONS = ['neutral', 'curious', 'happy', 'surprised', 'confused', 'proud', 'frustrated', 'provocative', 'mischievous', 'sleepy', 'sleeping'];

const BY_PERSONALITY = {
  light: { provocative: 'happy', mischievous: 'happy', frustrated: 'confused' },
  provocador: { confused: 'provocative', frustrated: 'mischievous' },
  ofensivo: { confused: 'mischievous', frustrated: 'irritated', curious: 'provocative' },
};

export function presentEmotion(emotion, personality = 'light') {
  const e = AI_EMOTIONS.includes(emotion) ? emotion : 'neutral';
  return BY_PERSONALITY[personality]?.[e] || e;
}
