/**
 * Provedor Supabase Auth (contas na nuvem, e-mail de recuperação real).
 * Usa a API REST oficial do GoTrue, sem dependências.
 * Ativação: em config/app.config.js -> AUTH.provider = 'supabase' + url + anonKey.
 */
import { AuthError } from '../AuthError.js';

export function createSupabaseProvider({ url, anonKey }) {
  const base = `${url.replace(/\/$/, '')}/auth/v1`;

  async function call(path, { method = 'POST', body, token } = {}) {
    let res;
    try {
      res = await fetch(base + path, {
        method,
        headers: {
          apikey: anonKey,
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new AuthError('network', 'Sem conexão com o servidor. Verifique sua internet e tente de novo.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = String(data.error_description || data.msg || data.message || '');
      if (/invalid login/i.test(msg)) throw new AuthError('invalid_credentials', 'E-mail ou senha incorretos.');
      if (/already registered/i.test(msg)) throw new AuthError('email_taken', 'Já existe uma conta com este e-mail.', 'email');
      if (/not confirmed/i.test(msg)) throw new AuthError('unconfirmed', 'Confirme seu e-mail pelo link que enviamos antes de entrar.');
      throw new AuthError('server', 'Não foi possível concluir agora. Tente de novo em instantes.');
    }
    return data;
  }

  const toUser = (u) => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name || u.email.split('@')[0],
    plan: u.app_metadata?.plan || 'free',
    createdAt: u.created_at,
  });

  return {
    capabilities: { passwordResetByEmail: true, label: 'Conta Zuno' },

    async signUp({ name, email, password }) {
      const data = await call('/signup', { body: { email, password, data: { name } } });
      if (!data.access_token) {
        throw new AuthError('unconfirmed', 'Conta criada. Enviamos um link de confirmação para o seu e-mail.');
      }
      return { user: toUser(data.user), session: { token: data.access_token, refresh: data.refresh_token } };
    },

    async signIn({ email, password }) {
      const data = await call('/token?grant_type=password', { body: { email, password } });
      return { user: toUser(data.user), session: { token: data.access_token, refresh: data.refresh_token } };
    },

    async signOut(s) {
      if (s?.token) await call('/logout', { token: s.token }).catch(() => {});
    },

    async requestPasswordReset(email) {
      await call('/recover', { body: { email } });
      return { sent: true, message: 'Se existir uma conta com este e-mail, você vai receber um link para criar uma nova senha.' };
    },

    async restore(s) {
      if (!s?.token) return null;
      try {
        return toUser(await call('/user', { method: 'GET', token: s.token }));
      } catch {
        return null;
      }
    },
  };
}
