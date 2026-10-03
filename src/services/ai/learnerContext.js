/**
 * Monta o "perfil do aluno" que a IA recebe: idioma, nível, unidade atual,
 * palavras estudadas, erros recentes, objetivo e personalidade.
 * Tudo vem do progresso real (ProgressService), nada inventado.
 */
import { getLanguage } from '../../domain/languages.js';
import { getCourse } from '../../content/index.js';
import { languageSummary, findExercise, findLesson, pad2 } from '../../domain/course.js';
import { ProgressService } from '../progress/ProgressService.js';
import { SettingsService } from '../settings/SettingsService.js';
import { GOALS } from '../../domain/world.js';
import { fillBlank, stripReading } from '../../components/exercises/shared.js';

export function learnerContext(user, code, { level } = {}) {
  const lang = getLanguage(code);
  const p = ProgressService.load(user.id);
  const settings = SettingsService.get(user.id);
  const summary = getCourse(code) ? languageSummary(code, p) : null;
  const totals = ProgressService.totals(p, code);

  const recentMistakes = ProgressService.pendingMistakes(p, code).slice(0, 6).map((m) => {
    const x = findExercise(m.exerciseId);
    if (!x) return null;
    const right = x.exercise.prompt?.includes('___') ? fillBlank(x.exercise.prompt, x.exercise.answer) : stripReading(x.exercise.answer);
    return `${right} (aluno respondeu: ${m.lastGiven})`;
  }).filter(Boolean);

  // Última aula concluída e estruturas que o aluno errou repetidas vezes
  const done = Object.entries(p.lessons).filter(([id, l]) => id.startsWith(`${code}-`) && l.status === 'completed')
    .sort((a, b) => Date.parse(b[1].updatedAt) - Date.parse(a[1].updatedAt));
  const lastCtx = done[0] ? findLesson(done[0][0]) : null;
  const repeated = ProgressService.pendingMistakes(p, code).filter((m) => m.count >= 2).slice(0, 4).map((m) => {
    const x = findExercise(m.exerciseId);
    return x ? (x.exercise.prompt?.includes('___') ? fillBlank(x.exercise.prompt, x.exercise.answer) : stripReading(x.exercise.answer)) : null;
  }).filter(Boolean);
  const placement = p.languages[code]?.placement;

  return {
    language: { code: lang.code, name: lang.name, native: lang.native },
    level: level || p.languages[code]?.level || 'A1',
    personality: SettingsService.personalityFor(user),
    learner: {
      unit: summary?.next ? `Unidade ${pad2(summary.next.unit.order)} · ${summary.next.unit.title}` : null,
      nextLesson: summary?.next?.lesson.title || null,
      wordsKnown: (p.stats.words[code] || []).slice(-30),
      recentMistakes,
      lessonsCompleted: totals.lessonsCompleted,
      goal: GOALS.find((g) => g.id === settings.goal)?.label || null,
      justStudied: lastCtx ? `${lastCtx.unit.title}${lastCtx.unit.grammar ? ` (${lastCtx.unit.grammar})` : ''}` : null,
      repeatedMistakes: repeated,
      placementGaps: (placement?.gaps || []).map((g) => `${g.cefr} ${g.title}`),
    },
  };
}
