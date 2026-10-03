/**
 * Configuração de IA no app.
 *
 * Os LIMITES REAIS vêm do servidor (tabela ai_limits, rota GET {apiBase}/status).
 * Os valores abaixo são só o padrão usado quando não há servidor
 * (ex.: página publicada no Claude, onde quem usa paga com a própria conta Claude)
 * e para mostrar o medidor antes da primeira resposta do servidor.
 */
export const DEFAULT_AI_LIMITS = {
  period: 'day',
  free: { chat: 15, world: 15, correct: 5, sessions: 3 },
  plus: { chat: 300, world: 300, correct: 100, sessions: 40 },
};

/** Situações do Modo Mundo liberadas no Free (o resto é Plus). Ver domain/world.js → free. */
export const FREE_WORLD_LIMIT_NOTE = 'No Free: Cafeteria, Aeroporto e Restaurante.';

/** Tier de modelo pedido ao Claude na página publicada. */
export const CLAUDE_PAGE_TIERS = { converse: 'quick', correct: 'default', explain: 'quick' };
