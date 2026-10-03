/**
 * Regras de navegação dentro de um curso: ordem das aulas, próxima atividade,
 * porcentagem concluída e estado de cada aula na trilha.
 */
import { getCourse } from '../content/index.js';
import { canAccessLesson } from '../services/access/AccessPolicy.js';

export const activeLevels = (course) => course.levels.filter((l) => l.active);
export const getLevel = (course, cefr) => course.levels.find((l) => l.cefr === cefr) || null;
export const levelLessons = (level) => level.units.flatMap((u) => u.lessons);

/** Encontra uma aula e todo o seu contexto pelo ID (ex.: en-a1-u1-l3). */
export function findLesson(lessonId) {
  const code = String(lessonId).split('-')[0];
  const course = getCourse(code);
  if (!course) return null;
  for (const level of course.levels) {
    const flat = levelLessons(level);
    for (const unit of level.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return { code, course, level, unit, lesson, index: flat.indexOf(lesson), flat };
    }
  }
  return null;
}

const isDone = (progress, id) => progress.lessons[id]?.status === 'completed';

/** Primeira aula ainda não concluída do nível (a "próxima atividade"). */
export function nextLesson(course, cefr, progress) {
  const level = getLevel(course, cefr);
  if (!level) return null;
  return levelLessons(level).find((l) => !isDone(progress, l.id)) || null;
}

export function levelPercent(course, cefr, progress) {
  const lessons = levelLessons(getLevel(course, cefr) || { units: [] });
  if (!lessons.length) return 0;
  return Math.round((lessons.filter((l) => isDone(progress, l.id)).length / lessons.length) * 100);
}

/**
 * Estado de uma aula na trilha:
 *  completed · current · available · locked (sequência) · plus (exige Plus) · soon (sem conteúdo)
 */
const ORDER = { A1: 1, A2: 2, B1: 3, B2: 4, C2: 5 };

/** Nível que o teste de nível indicou (ponto de partida), se houver. */
export const placementOf = (progress, code) => progress.languages[code]?.placement || null;

export function lessonState({ lesson, flat, index, code, level }, progress, user) {
  if (isDone(progress, lesson.id)) return 'completed';
  if (!canAccessLesson(user, lesson).allowed) return 'plus';
  // Abaixo do ponto de partida do teste: tudo liberado para revisar no seu ritmo.
  const placed = placementOf(progress, code || lesson.id.split('-')[0]);
  const below = placed && level && (ORDER[placed.estimated] || 0) > (ORDER[level.cefr] || 0);
  const prevDone = below || index === 0 || isDone(progress, flat[index - 1].id);
  if (!prevDone) return 'locked';
  if (!lesson.exercises.length) return 'soon';
  const firstOpen = flat.find((l) => !isDone(progress, l.id));
  return firstOpen?.id === lesson.id ? 'current' : 'available';
}

/** Resumo de um idioma para Home, Aprender e Progresso. */
export function languageSummary(code, progress) {
  const course = getCourse(code);
  let cefr = progress.languages[code]?.level || 'A1';
  // Se o nível atual acabou, a próxima atividade vem do nível seguinte.
  let next = nextLesson(course, cefr, progress);
  if (!next) {
    const after = course.levels.filter((l) => (ORDER[l.cefr] || 0) > (ORDER[cefr] || 0));
    for (const lv of after) {
      const n = nextLesson(course, lv.cefr, progress);
      if (n) { next = n; cefr = lv.cefr; break; }
    }
  }
  const level = getLevel(course, cefr);
  const ctx = next ? findLesson(next.id) : null;
  const flat = levelLessons(level);
  return {
    code,
    cefr,
    percent: levelPercent(course, cefr, progress),
    completed: flat.filter((l) => isDone(progress, l.id)).length,
    total: flat.length,
    next: ctx, // { unit, lesson, ... } ou null quando o nível acabou
  };
}

export const pad2 = (n) => String(n).padStart(2, '0');

/** Unidades que o teste mostrou como lacuna (recomendadas para reforço). */
export function recommendedUnits(progress, code) {
  return new Set(placementOf(progress, code)?.gaps?.map((g) => g.unitId) || []);
}

/** Encontra um exercício pelo ID (ex.: en-a1-u1-l3-e2) com o contexto da aula. */
export function findExercise(exerciseId) {
  const lessonId = String(exerciseId).replace(/-e\d+$/, '');
  const ctx = findLesson(lessonId);
  const exercise = ctx?.lesson.exercises.find((e) => e.id === exerciseId);
  return exercise ? { ...ctx, exercise } : null;
}
