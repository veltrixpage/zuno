/**
 * ⚡ Modo Difícil · "Sem moleza."
 *
 * Transforma a aula normal em uma versão mais dura, sem alterar o conteúdo base:
 *  - menos dicas: sem leitura (romaji/pinyin) e sem romanização nas opções
 *  - menos tradução: a tradução da fala do Zuno fica escondida (toque para ver)
 *  - mais escrita: "complete a frase" vira digitação (idiomas de alfabeto latino)
 *  - mais tradução digitada: "como se diz?" vira escrita
 *  - mais listening: "o que significa?" vira "escute e responda" (quando há voz no aparelho)
 *  - frases maiores: "monte a frase" ganha palavras extras para confundir
 *  - mais XP: +50%
 *
 * Acesso: Free experimenta a 1ª aula de cada idioma; Plus tem o modo completo.
 */
import { SpeechService } from '../services/audio/SpeechService.js';

export const HARD_MODE = { label: 'Modo Difícil', tagline: 'Sem moleza.', xpMultiplier: 1.5 };

const LATIN = new Set(['en', 'es', 'it', 'fr', 'de', 'pt']);
const stripReading = (s) => String(s).replace(/\s*\([^)]*\)\s*$/, '');

export function canUseHardMode(user, lesson) {
  if (user?.plan === 'plus') return { allowed: true };
  const firstLesson = /-a1-u1-l1$/.test(lesson.id);
  return { allowed: firstLesson, reason: firstLesson ? null : 'plus' };
}

export function hardenLesson(lesson, code) {
  const latin = LATIN.has(code);
  const canListen = SpeechService.canSpeak(code);

  const exercises = lesson.exercises.map((ex) => {
    const e = { ...ex, reading: null, hard: true };
    if (e.options) e.options = e.options.map((o) => ({ ...o, label: latin ? o.label : stripReading(o.label) }));
    if (e.answer && !latin) e.answer = stripReading(e.answer);

    if (e.type === 'choice' && e.kind === 'complete' && latin) {
      return { ...e, type: 'write', instruction: 'Escreva a palavra que falta', accept: [e.answer], options: undefined };
    }
    if (e.type === 'choice' && e.kind === 'translate' && latin) {
      return { ...e, type: 'write', kind: 'typed', instruction: 'Traduza', accept: [e.answer], typedTranslation: true, options: undefined };
    }
    if (e.type === 'choice' && e.kind === 'meaning' && canListen) {
      return { ...e, kind: 'listen', instruction: 'Escute e responda', say: stripReading(ex.prompt), prompt: 'O que significa o que você ouviu?' };
    }
    if (e.type === 'order') {
      const extra = lesson.words.filter((w) => !e.tokens.includes(w) && !w.includes(' ')).slice(0, 2);
      return { ...e, distractors: [...new Set([...(e.distractors || []), ...extra])] };
    }
    return e;
  });

  return { ...lesson, exercises, hard: true, xp: Math.round(lesson.xp * HARD_MODE.xpMultiplier) };
}
