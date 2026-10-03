/**
 * AuthService: interface única de autenticação.
 * As telas só conversam com este arquivo; o provedor real (local ou Supabase)
 * é escolhido em config/app.config.js.
 *
 * Contrato de um provedor:
 *   signUp({ name, email, password })            -> user
 *   signIn({ email, password })                  -> user
 *   signOut()                                     -> void
 *   requestPasswordReset(email)                  -> { sent: boolean, message }
 *   restore()                                     -> user | null
 *   capabilities: { passwordResetByEmail: boolean, label: string }
 */
import { AUTH } from '../../config/app.config.js';
import { createLocalProvider } from './providers/local.provider.js';
import { createSupabaseProvider } from './providers/supabase.provider.js';
import { session, local } from '../../core/storage.js';

export { AuthError } from './AuthError.js';

const SESSION_KEY = 'auth.session';

function pickProvider() {
  if (AUTH.provider === 'supabase' && AUTH.supabase.url && AUTH.supabase.anonKey) {
    return createSupabaseProvider(AUTH.supabase);
  }
  return createLocalProvider();
}

const provider = pickProvider();

/** Sessão: "manter conectado" grava no localStorage; senão, só nesta aba. */
function saveSession(data, remember) {
  (remember ? local : session).set(SESSION_KEY, data);
  (remember ? session : local).remove(SESSION_KEY);
}
function readSession() {
  return session.get(SESSION_KEY) || local.get(SESSION_KEY);
}
function clearSession() {
  session.remove(SESSION_KEY);
  local.remove(SESSION_KEY);
}

export const AuthService = {
  capabilities: provider.capabilities,

  async signUp(input, { remember = false } = {}) {
    const result = await provider.signUp(input);
    saveSession(result.session, remember);
    return result.user;
  },

  async signIn(input, { remember = false } = {}) {
    const result = await provider.signIn(input);
    saveSession(result.session, remember);
    return result.user;
  },

  async signOut() {
    const s = readSession();
    clearSession();
    await provider.signOut(s);
  },

  requestPasswordReset: (email) => provider.requestPasswordReset(email),

  async restore() {
    const s = readSession();
    if (!s) return null;
    const user = await provider.restore(s);
    if (!user) clearSession();
    return user;
  },
};

/* ---------- Validação compartilhada pelos formulários ---------- */

export const validators = {
  email(value) {
    if (!value.trim()) return 'Digite seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return 'Este e-mail não parece válido.';
    return '';
  },
  password(value) {
    if (!value) return 'Digite sua senha.';
    if (value.length < AUTH.passwordMinLength) return `Use pelo menos ${AUTH.passwordMinLength} caracteres.`;
    return '';
  },
  name(value) {
    if (!value.trim()) return 'Como podemos te chamar?';
    if (value.trim().length < 2) return 'Use pelo menos 2 letras.';
    return '';
  },
};
