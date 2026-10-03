/**
 * Configuração central do Zuno.
 * Tudo que for "regra de produto" (planos, recursos, provedores) mora aqui,
 * para que os próximos módulos (IA, Modo Difícil, Plus, assinatura...) sejam
 * ligados por configuração, sem reescrever telas.
 */
export const APP = Object.freeze({
  name: 'Zuno',
  tagline: 'Seu mundo está ficando maior.',
  version: '0.1.0',
});

/**
 * Autenticação.
 * - 'local': contas reais armazenadas neste navegador, com senha protegida por
 *   PBKDF2 (Web Crypto). Útil enquanto não existe servidor.
 * - 'supabase': contas no servidor (Supabase Auth). Basta preencher url e anonKey.
 */
export const AUTH = Object.freeze({
  provider: 'local',
  supabase: {
    url: '',      // ex.: https://xxxx.supabase.co
    anonKey: '',  // chave pública "anon"
  },
  passwordMinLength: 8,
});

/** Planos. Ainda sem cobrança: só a estrutura para o sistema Free / Plus. */
export const PLANS = Object.freeze({
  free: { id: 'free', label: 'Free' },
  plus: { id: 'plus', label: 'Plus' },
});

/**
 * Feature flags. Cada recurso futuro entra desligado e é ativado aqui.
 * As telas consultam `isEnabled('worldMode')` em vez de checar coisas soltas.
 */
export const FEATURES = Object.freeze({
  lessons: false,
  hardMode: false,
  worldMode: false,
  ai: false,
  subscriptions: false,
  zunoEvolution: false,
  zunoPersonalities: false,
});

export const isEnabled = (flag) => Boolean(FEATURES[flag]);
