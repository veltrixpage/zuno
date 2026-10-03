/**
 * Preferências do usuário (uma personalidade ativa por vez).
 * Salvas por usuário neste dispositivo e enviadas ao banco quando o Supabase
 * estiver configurado (função set_preferences, valida Plus no servidor).
 */
import { local } from '../../core/storage.js';
import { sync } from '../progress/sync/index.js';
import { getPersonality } from '../../zuno/reactions.js';

const key = (userId) => `settings.${userId}`;

const DEFAULTS = {
  personality: 'light',
  reduceMotion: false,
  sound: true,
  showTranslation: true,
};

export const SettingsService = {
  get(userId) {
    return { ...DEFAULTS, ...local.get(key(userId), {}) };
  },

  /** Personalidade efetiva: se o plano não permite, volta para Light. */
  personalityFor(user) {
    const id = this.get(user.id).personality;
    const p = getPersonality(id);
    return p.tier === 'plus' && user.plan !== 'plus' ? 'light' : p.id;
  },

  canUsePersonality(user, id) {
    const p = getPersonality(id);
    return p.tier !== 'plus' || user.plan === 'plus';
  },

  setPersonality(user, id) {
    if (!this.canUsePersonality(user, id)) return { ok: false, reason: 'plus' };
    return { ok: true, settings: this.update(user.id, { personality: getPersonality(id).id }) };
  },

  update(userId, patch) {
    const next = { ...this.get(userId), ...patch };
    local.set(key(userId), next);
    applyMotion(next.reduceMotion);
    sync.push('preferences_changed', { userId, ...next });
    return next;
  },

  apply(userId) {
    applyMotion(this.get(userId).reduceMotion);
  },
};

/** Redução de movimento: preferência do sistema OU escolha no app. */
export function applyMotion(reduce) {
  document.documentElement.toggleAttribute('data-reduce-motion', Boolean(reduce));
}

export const prefersReducedMotion = () =>
  document.documentElement.hasAttribute('data-reduce-motion') ||
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
