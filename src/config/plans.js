/**
 * Planos Free × Plus (configurável num lugar só).
 * O servidor repete as mesmas regras (lessons.tier no banco + função complete_lesson).
 */
export const PLUS_PRICE = { amount: 19.9, currency: 'BRL', period: 'mês', label: 'R$ 19,90/mês' };

/**
 * Conteúdo gratuito por nível: o Free aprende de verdade o começo de cada nível
 * e depois o curso trava progressivamente.
 *  units: N   → as N primeiras unidades inteiras são grátis
 *  lessons: N → só as N primeiras aulas do nível são grátis
 */
export const FREE_POLICY = {
  A1: { units: 4 },
  A2: { units: 1 },
  B1: { lessons: 1 },
  B2: { lessons: 1 },
  C2: { lessons: 1 },
};

/** Personalidades por plano. */
export const PLAN_PERSONALITIES = { free: ['light', 'provocador'], plus: ['light', 'provocador', 'ofensivo'] };

/** Pronúncia: quantas frases o Free pode praticar por idioma. */
export const FREE_PRONUNCIATION_PHRASES = 3;
