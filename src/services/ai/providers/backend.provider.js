/**
 * Provedor "backend": a IA roda no SEU servidor (supabase/functions/zuno-ai).
 * A chave da IA fica só lá. O servidor também aplica os limites Free/Plus.
 */
import { apiUrl, authToken } from '../backendStatus.js';
import { AIError } from '../AIError.js';

export function createBackendProvider() {
  return {
    id: 'backend',
    label: 'IA do servidor Zuno',
    async run(task, context, { signal } = {}) {
      let res;
      try {
        res = await fetch(apiUrl('/ai'), {
          method: 'POST',
          signal,
          headers: { 'Content-Type': 'application/json', ...(authToken() ? { Authorization: `Bearer ${authToken()}` } : {}) },
          body: JSON.stringify({ task, context }),
        });
      } catch (e) {
        if (e?.name === 'AbortError') throw new AIError('cancelled');
        throw new AIError('network');
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) throw new AIError('auth');
      if (res.status === 402) throw new AIError('plus');
      if (res.status === 429) throw new AIError('limit', null, data.usage);
      if (res.status === 501) throw new AIError('not_configured');
      if (!res.ok) throw new AIError('upstream');
      return { result: data.result, usage: data.usage || null };
    },
  };
}
