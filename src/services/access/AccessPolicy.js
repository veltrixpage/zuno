/**
 * Regras de acesso Free × Plus.
 *
 * - Todos os idiomas são liberados para todos.
 * - O bloqueio acontece dentro do curso: cada aula tem `tier` ('free' | 'plus'),
 *   vindo do conteúdo (coluna lessons.tier no banco).
 * - Plano Free: só aulas 'free'. Plano Plus: tudo.
 *
 * No Supabase, a mesma regra é validada no servidor (função complete_lesson).
 */
const PLAN_TIERS = {
  free: ['free'],
  plus: ['free', 'plus'],
};

export function canAccessLesson(user, lesson) {
  const plan = user?.plan || 'free';
  const allowed = (PLAN_TIERS[plan] || PLAN_TIERS.free).includes(lesson.tier);
  return { allowed, reason: allowed ? null : 'plus' };
}

export const isPlus = (user) => user?.plan === 'plus';
