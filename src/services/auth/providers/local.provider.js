/**
 * Provedor local de contas.
 * Contas reais, salvas apenas neste navegador. A senha nunca é guardada:
 * guardamos um hash PBKDF2-SHA256 (150 mil iterações) com sal aleatório.
 *
 * Limitação: a conta existe somente neste dispositivo e a recuperação de senha
 * por e-mail não é possível sem servidor. Para contas na nuvem, use o provedor
 * Supabase em config/app.config.js.
 */
import { local } from '../../../core/storage.js';
import { AuthError } from '../AuthError.js';

const USERS_KEY = 'auth.users';
const ITERATIONS = 150000;

const enc = new TextEncoder();
const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex) => new Uint8Array(hex.match(/.{2}/g).map((x) => parseInt(x, 16)));

async function hashPassword(password, saltHex) {
  if (!globalThis.crypto?.subtle) {
    throw new AuthError('insecure', 'Abra o Zuno por um endereço seguro (https) para criar ou acessar contas.');
  }
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations: ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

const randomHex = (bytes = 16) => toHex(crypto.getRandomValues(new Uint8Array(bytes)));

/** Comparação em tempo constante. */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const normalize = (email) => email.trim().toLowerCase();
const users = () => local.get(USERS_KEY, {});
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, plan: u.plan, createdAt: u.createdAt });

export function createLocalProvider() {
  return {
    capabilities: { passwordResetByEmail: false, label: 'Conta neste dispositivo' },

    async signUp({ name, email, password }) {
      const all = users();
      const key = normalize(email);
      if (all[key]) throw new AuthError('email_taken', 'Já existe uma conta com este e-mail.', 'email');
      const salt = randomHex();
      const user = {
        id: crypto.randomUUID ? crypto.randomUUID() : randomHex(16),
        name: name.trim(),
        email: key,
        plan: 'free',
        salt,
        hash: await hashPassword(password, salt),
        createdAt: new Date().toISOString(),
      };
      local.set(USERS_KEY, { ...all, [key]: user });
      return { user: publicUser(user), session: { userId: user.id, email: key, token: randomHex(24) } };
    },

    async signIn({ email, password }) {
      const user = users()[normalize(email)];
      // Mesma mensagem para e-mail inexistente e senha errada (não revela contas).
      const fail = new AuthError('invalid_credentials', 'E-mail ou senha incorretos.');
      if (!user) {
        await hashPassword(password, randomHex()); // tempo semelhante
        throw fail;
      }
      const hash = await hashPassword(password, user.salt);
      if (!safeEqual(hash, user.hash)) throw fail;
      return { user: publicUser(user), session: { userId: user.id, email: user.email, token: randomHex(24) } };
    },

    async signOut() {},

    async requestPasswordReset() {
      return {
        sent: false,
        message:
          'Nesta versão, as contas ficam salvas só neste dispositivo, então ainda não conseguimos enviar e-mail de recuperação. Isso será ativado quando o servidor de contas for conectado.',
      };
    },

    async restore(s) {
      const user = s?.email ? users()[s.email] : null;
      return user && user.id === s.userId ? publicUser(user) : null;
    },
  };
}
