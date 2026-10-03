/**
 * Medidor de uso da IA (mensagens por período, por recurso e plano).
 *
 * - Com backend: o SERVIDOR é a autoridade (tabelas ai_limits e ai_usage).
 *   Aqui só guardamos o que ele devolve para mostrar o medidor.
 * - Sem backend (Claude na página): contamos neste dispositivo, com os
 *   limites padrão de config/ai.config.js. O custo é da conta Claude de quem usa.
 */
import { local } from '../../core/storage.js';
import { DEFAULT_AI_LIMITS } from '../../config/ai.config.js';

const key = (userId) => `ai.usage.${userId}`;
const today = () => new Date().toISOString().slice(0, 10);

let serverLimits = null;

export const UsageService = {
  setServerLimits(limits) { serverLimits = limits; },

  limitsFor(user) {
    const src = serverLimits || DEFAULT_AI_LIMITS;
    return src[user.plan === 'plus' ? 'plus' : 'free'] || DEFAULT_AI_LIMITS.free;
  },

  read(userId) {
    const u = local.get(key(userId), null);
    return u && u.day === today() ? u : { day: today(), chat: 0, world: 0, correct: 0, sessions: 0 };
  },

  remaining(user, feature) {
    const lim = this.limitsFor(user)[feature] ?? 0;
    return Math.max(0, lim - (this.read(user.id)[feature] || 0));
  },

  canUse(user, feature) {
    return this.remaining(user, feature) > 0;
  },

  /** Registra um uso (ou aplica o número que o servidor mandou). */
  record(userId, feature, serverUsage) {
    const u = this.read(userId);
    if (serverUsage && typeof serverUsage.used === 'number') u[feature] = serverUsage.used;
    else u[feature] = (u[feature] || 0) + 1;
    local.set(key(userId), u);
    return u;
  },
};
