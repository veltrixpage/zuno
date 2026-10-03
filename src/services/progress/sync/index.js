/**
 * Sincronização do progresso com o banco.
 * - Sem Supabase configurado: não faz nada (tudo fica no dispositivo).
 * - Com Supabase: envia cada evento para a função `complete_lesson` /
 *   tabela `user_languages`. Eventos que falham ficam numa fila e são
 *   reenviados na próxima vez que o app abrir.
 */
import { AUTH } from '../../../config/app.config.js';
import { local } from '../../../core/storage.js';
import { createSupabaseSync } from './supabase.sync.js';

const QUEUE_KEY = 'sync.queue';
const enabled = AUTH.provider === 'supabase' && AUTH.supabase.url && AUTH.supabase.anonKey;
const remote = enabled ? createSupabaseSync(AUTH.supabase) : null;

async function send(evt) {
  if (!remote) return true;
  try {
    await remote.send(evt);
    return true;
  } catch {
    return false;
  }
}

export const sync = {
  enabled: Boolean(remote),

  async push(type, payload) {
    if (!remote) return;
    const evt = { type, payload, at: new Date().toISOString() };
    if (!(await send(evt))) local.set(QUEUE_KEY, [...local.get(QUEUE_KEY, []), evt]);
  },

  async flush() {
    if (!remote) return;
    const queue = local.get(QUEUE_KEY, []);
    const failed = [];
    for (const evt of queue) if (!(await send(evt))) failed.push(evt);
    local.set(QUEUE_KEY, failed);
  },
};
