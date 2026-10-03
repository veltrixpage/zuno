/**
 * Teste de nível adaptativo (quiz inicial).
 *
 * Funciona em "escada": acertou, a próxima pergunta sobe de nível; errou, desce.
 * Usa perguntas reais do curso (português → idioma), de unidades diferentes.
 *
 * O resultado NÃO pula o ensino. Ele define:
 *  - o ponto de partida (nível estimado),
 *  - o ritmo (níveis abaixo viram "revisão rápida", ainda ensinando),
 *  - as lacunas (unidades que precisam de reforço, mesmo abaixo do nível),
 *  - os pontos fortes.
 */
import { getCourse } from '../content/index.js';

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C2'];
export const BUCKET = { A1: 'Iniciante', A2: 'Iniciante', B1: 'Intermediário', B2: 'Intermediário', C2: 'Avançado' };

export const SELF_REPORT = [
  { id: 'never', label: 'Nunca estudei', start: 0, questions: 5 },
  { id: 'basic', label: 'Sei o básico', start: 0, questions: 7 },
  { id: 'ok', label: 'Me viro bem', start: 2, questions: 8 },
  { id: 'advanced', label: 'Sou avançado', start: 3, questions: 8 },
];

/** Uma pergunta por unidade (português → idioma), por nível. */
function questionBank(code) {
  const course = getCourse(code);
  const bank = {};
  for (const level of course.levels) {
    bank[level.cefr] = level.units
      .filter((u) => !u.id.endsWith('-u1')) // a unidade antiga usa outro formato
      .map((u) => {
        const ex = u.lessons.flatMap((l) => l.exercises).find((e) => e.type === 'choice' && e.kind === 'translate');
        return ex ? { exercise: ex, cefr: level.cefr, unitId: u.id, unitTitle: u.title } : null;
      })
      .filter(Boolean);
  }
  return bank;
}

export function createPlacementTest(code, declaredId) {
  const declared = SELF_REPORT.find((s) => s.id === declaredId) || SELF_REPORT[0];
  const bank = questionBank(code);
  const used = new Set();
  const history = [];
  let idx = declared.start;

  return {
    declared,
    total: declared.questions,
    get asked() { return history.length; },
    get done() { return history.length >= declared.questions; },

    next() {
      for (let d = 0; d < LEVELS.length; d += 1) {
        // procura no nível atual; se acabou, no vizinho mais próximo
        for (const off of d === 0 ? [0] : [-d, d]) {
          const lv = LEVELS[idx + off];
          const q = lv && (bank[lv] || []).find((x) => !used.has(x.unitId));
          if (q) { used.add(q.unitId); return q; }
        }
      }
      return null;
    },

    answer(q, correct) {
      history.push({ cefr: q.cefr, unitId: q.unitId, unitTitle: q.unitTitle, correct });
      idx = Math.max(0, Math.min(LEVELS.length - 1, idx + (correct ? 1 : -1)));
    },

    result() {
      const by = {};
      for (const h of history) {
        by[h.cefr] = by[h.cefr] || { right: 0, total: 0 };
        by[h.cefr].total += 1;
        if (h.correct) by[h.cefr].right += 1;
      }
      let estimated = 'A1';
      for (const lv of LEVELS) {
        const r = by[lv];
        if (r && r.right >= 1 && r.right / r.total >= 0.5) estimated = lv;
      }
      const order = LEVELS.indexOf(estimated);
      const strengths = history.filter((h) => h.correct).map((h) => ({ unitId: h.unitId, title: h.unitTitle, cefr: h.cefr }));
      // Lacuna: errou algo do nível estimado ou abaixo dele (mesmo dizendo ser avançado)
      const gaps = history.filter((h) => !h.correct && LEVELS.indexOf(h.cefr) <= order).map((h) => ({ unitId: h.unitId, title: h.unitTitle, cefr: h.cefr }));
      const nextUp = history.filter((h) => !h.correct && LEVELS.indexOf(h.cefr) > order).map((h) => ({ unitId: h.unitId, title: h.unitTitle, cefr: h.cefr }));
      return {
        estimated,
        bucket: BUCKET[estimated],
        declared: declared.id,
        strengths,
        gaps,
        practice: [...gaps, ...nextUp].slice(0, 4),
        correct: history.filter((h) => h.correct).length,
        total: history.length,
      };
    },
  };
}

/** Primeira aula recomendada depois do teste. */
export function startingLesson(code, estimated) {
  const level = getCourse(code).levels.find((l) => l.cefr === estimated);
  return level?.units[0]?.lessons[0] || null;
}
