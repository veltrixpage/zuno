/**
 * Pergunta ao backend próprio o que está configurado (IA, voz, pronúncia, limites).
 * Sem ZUNO_API_BASE no build, nada é chamado e tudo é "não configurado".
 */
import { INTEGRATIONS } from '../../config/integrations.js';
import { session, local } from '../../core/storage.js';

let cached = null;

export const authToken = () => (session.get('auth.session') || local.get('auth.session'))?.token || null;

export async function backendStatus() {
  if (!INTEGRATIONS.apiBase) return { reachable: false, ai: false, tts: false, stt: false, limits: null };
  if (cached) return cached;
  try {
    const res = await fetch(`${INTEGRATIONS.apiBase.replace(/\/$/, '')}/status`, {
      headers: authToken() ? { Authorization: `Bearer ${authToken()}` } : {},
    });
    const data = await res.json();
    cached = { reachable: true, ai: Boolean(data.ai), tts: Boolean(data.tts), stt: Boolean(data.stt), limits: data.limits || null, usage: data.usage || null };
  } catch {
    cached = { reachable: false, ai: false, tts: false, stt: false, limits: null };
  }
  return cached;
}

export function apiUrl(path) {
  return `${INTEGRATIONS.apiBase.replace(/\/$/, '')}${path}`;
}
