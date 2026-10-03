/**
 * ZunoBrain: decide como o Zuno reage, olhando para o contexto da aula.
 *
 * Considera: personalidade, acertos e erros seguidos, erro repetido na mesma
 * pergunta, tempo parado, Modo Difícil, ausência de dias e se o usuário é
 * iniciante. A mesma resposta errada não gera sempre a mesma reação.
 *
 * Cada decisão devolve:
 *   { state, motion, look, line, laugh, sequence }
 *     state    → estado emocional (zuno.states.js)
 *     motion   → animação curta ('celebrate' | 'pop' | 'shake' | 'laugh' | 'laugh-big' | null)
 *     look     → para onde ele olha antes de falar ('answer' | 'question' | null)
 *     line     → fala (ou null: o Zuno também sabe ficar quieto)
 *     laugh    → 'soft' | 'mischievous' | 'big' | null
 *     sequence → 'error' quando a reação deve acontecer em etapas
 */
import { pickLine, getPersonality } from './reactions.js';

const WRONG_STATE = {
  light:      { wrong1: 'confused', wrong2: 'sad', wrong3: 'confused', wrong_same: 'confused' },
  provocador: { wrong1: 'provocative', wrong2: 'mischievous', wrong3: 'irritated', wrong_same: 'mischievous' },
  ofensivo:   { wrong1: 'mischievous', wrong2: 'irritated', wrong3: 'irritated', wrong_same: 'mischievous' },
};

export function createZunoBrain({ personality = 'light', hard = false, beginner = false, daysAway = 0 } = {}) {
  const p = getPersonality(personality);
  const s = { correctStreak: 0, wrongStreak: 0, correct: 0, wrong: 0, missed: new Set(), answersSinceLaugh: 99 };

  /** Risada só quando ele "acha graça": não em toda resposta. */
  function laughFor(line) {
    if (!line?.laugh || p.id === 'light') return null;
    if (s.answersSinceLaugh < 2) return null; // não ri duas vezes seguidas
    s.answersSinceLaugh = 0;
    return line.laugh;
  }

  return {
    stats: s,

    start() {
      if (hard) {
        const line = pickLine(p.id, 'hard_start');
        return { state: p.id === 'light' ? 'curious' : 'provocative', motion: 'pop', look: 'question', line, laugh: null };
      }
      if (daysAway >= 3) {
        return { state: 'surprised', motion: 'pop', look: null, line: pickLine(p.id, 'return'), laugh: null, then: 'happy' };
      }
      // Normal: ele só olha para a pergunta e fica quieto.
      return { state: 'neutral', motion: null, look: 'question', line: null, laugh: null };
    },

    /** Nova pergunta: postura neutra, sem falar. */
    next() {
      return { state: s.wrongStreak >= 2 && p.id !== 'light' ? 'provocative' : 'neutral', motion: null, look: 'question', line: null, laugh: null };
    },

    answer({ correct, exerciseId }) {
      s.answersSinceLaugh += 1;
      if (correct) {
        s.correct += 1;
        s.correctStreak += 1;
        const recovering = s.wrongStreak >= 2;
        s.wrongStreak = 0;
        if (recovering) return { state: 'happy', motion: 'celebrate', line: pickLine(p.id, 'comeback'), laugh: null };
        if (s.correctStreak >= 3 && s.correctStreak % 3 === 0) {
          const line = pickLine(p.id, 'proud');
          return { state: 'proud', motion: 'celebrate', line, laugh: laughFor(line) };
        }
        // Acertos comuns: nem sempre fala (às vezes só comemora em silêncio).
        const speak = s.correctStreak === 1 || Math.random() < 0.65;
        return { state: 'happy', motion: 'celebrate', line: speak ? pickLine(p.id, 'correct') : null, laugh: null };
      }

      s.wrong += 1;
      s.correctStreak = 0;
      s.wrongStreak += 1;
      const repeated = s.missed.has(exerciseId);
      s.missed.add(exerciseId);

      let event = s.wrongStreak >= 3 ? 'wrong3' : s.wrongStreak === 2 ? 'wrong2' : 'wrong1';
      if (repeated) event = 'wrong_same';
      // Iniciante no primeiro erro: sem risada, reação mais leve.
      const gentleFirst = beginner && s.wrong === 1;
      const line = pickLine(p.id, event, { avoidLaugh: gentleFirst });
      const laugh = gentleFirst ? null : laughFor(line);
      return {
        state: (WRONG_STATE[p.id] || WRONG_STATE.light)[event],
        motion: laugh ? (laugh === 'big' ? 'laugh-big' : 'laugh') : 'shake',
        look: 'answer',
        line,
        laugh,
        sequence: 'error',
      };
    },

    /** Usuário parado: primeiro curioso, depois sonolento/impaciente. */
    idle(level) {
      if (level === 1) return { state: 'curious', motion: 'pop', line: pickLine(p.id, 'idle'), laugh: null };
      return { state: p.id === 'light' ? 'sleepy' : 'irritated', motion: null, line: null, laugh: null };
    },

    complete({ perfect }) {
      const line = pickLine(p.id, 'complete');
      return { state: perfect ? 'proud' : 'happy', motion: 'celebrate', line, laugh: laughFor(line) };
    },
  };
}
