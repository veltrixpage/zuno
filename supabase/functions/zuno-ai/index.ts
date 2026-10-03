// =====================================================================
// ZUNO · Função de IA no servidor (Supabase Edge Function / Deno)
//
// Rotas (ZUNO_API_BASE = https://<projeto>.supabase.co/functions/v1/zuno-ai):
//   GET  /status         → o que está configurado + limites do plano + uso
//   POST /ai             → { task, context }  (converse | correct | explain)
//   POST /tts            → voz própria do Zuno (precisa de provedor de voz)
//   POST /pronunciation  → análise de pronúncia (precisa de provedor de fala)
//
// Segredos (NUNCA no frontend) — configure com `supabase secrets set`:
//   ANTHROPIC_API_KEY   chave da IA
//   ZUNO_AI_MODEL       nome do modelo (ex.: o modelo Claude que você contratar)
//   TTS_API_URL / TTS_API_KEY   (opcional) serviço de voz
//   STT_API_URL / STT_API_KEY   (opcional) serviço de análise de pronúncia
// SUPABASE_URL e SUPABASE_ANON_KEY já existem no ambiente das funções.
//
// Deploy:  npm run functions && supabase functions deploy zuno-ai
// =====================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildPrompt, AI_TASKS, TASK_FEATURE } from '../_shared/prompts.js';

const env = (k: string) => Deno.env.get(k) || '';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const FREE_WORLD = ['cafeteria', 'aeroporto', 'restaurante'];

function supabaseFor(req: Request) {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
  });
}

async function currentUser(sb: ReturnType<typeof createClient>) {
  const { data } = await sb.auth.getUser();
  if (!data?.user) return null;
  const { data: profile } = await sb.from('profiles').select('plan, personality').eq('id', data.user.id).single();
  return { id: data.user.id, plan: profile?.plan || 'free', personality: profile?.personality || 'light' };
}

/** Extrai o primeiro objeto JSON da resposta do modelo. */
function parseJson(text: string) {
  try { return JSON.parse(text); } catch { /* segue */ }
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch { /* segue */ } }
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a >= 0 && b > a) return JSON.parse(text.slice(a, b + 1));
  throw new Error('invalid_json');
}

async function callModel(prompt: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: env('ZUNO_AI_MODEL'),
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`upstream_${res.status}`);
  const data = await res.json();
  const text = (data.content || []).filter((c: { type: string }) => c.type === 'text').map((c: { text: string }) => c.text).join('');
  return parseJson(text);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const route = new URL(req.url).pathname.split('/').pop();
  const aiReady = Boolean(env('ANTHROPIC_API_KEY') && env('ZUNO_AI_MODEL'));
  const sb = supabaseFor(req);

  // ---------- status ----------
  if (route === 'status') {
    const user = await currentUser(sb);
    const { data: limits } = await sb.from('ai_limits').select('plan, feature, max_per_period, period');
    const shaped: Record<string, Record<string, number>> = { free: {}, plus: {} };
    for (const l of limits || []) shaped[l.plan][l.feature] = l.max_per_period;
    let usage = null;
    if (user) {
      const { data } = await sb.rpc('ai_usage_today');
      usage = data;
    }
    return json({ ai: aiReady, tts: Boolean(env('TTS_API_URL')), stt: Boolean(env('STT_API_URL')), limits: limits?.length ? shaped : null, usage });
  }

  const user = await currentUser(sb);
  if (!user) return json({ error: 'auth' }, 401);

  // ---------- IA ----------
  if (route === 'ai' && req.method === 'POST') {
    if (!aiReady) return json({ error: 'not_configured' }, 501);
    const { task, context } = await req.json();
    if (!AI_TASKS.includes(task)) return json({ error: 'bad_task' }, 400);

    // Regras de plano validadas AQUI (o app não decide sozinho)
    if (context?.mode === 'world' && !FREE_WORLD.includes(context?.situation?.id) && user.plan !== 'plus') return json({ error: 'plus' }, 402);
    const personality = context?.personality === 'ofensivo' && user.plan !== 'plus' ? 'light' : (context?.personality || user.personality);

    const feature = context?.mode === 'world' ? 'world' : TASK_FEATURE[task];
    const { data: quota, error: qerr } = await sb.rpc('ai_consume', { p_feature: feature });
    if (qerr) return json({ error: 'quota' }, 500);
    if (!quota?.allowed) return json({ error: 'limit', usage: quota }, 429);

    try {
      const result = await callModel(buildPrompt(task, { ...context, personality }));
      return json({ result, usage: { used: quota.used, limit: quota.limit } });
    } catch (e) {
      return json({ error: String(e?.message || e) }, 502);
    }
  }

  // ---------- voz e pronúncia: só com provedor configurado ----------
  if (route === 'tts' && req.method === 'POST') {
    if (!env('TTS_API_URL')) return json({ error: 'not_configured' }, 501);
    const body = await req.json(); // { text, language, style, slow }
    // Adapte este bloco ao formato do seu provedor de voz.
    const res = await fetch(env('TTS_API_URL'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${env('TTS_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return json({ error: 'upstream' }, 502);
    return new Response(await res.arrayBuffer(), { headers: { ...CORS, 'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg' } });
  }

  if (route === 'pronunciation' && req.method === 'POST') {
    if (!env('STT_API_URL')) return json({ error: 'not_configured' }, 501);
    // Adapte ao seu provedor e devolva: { pronunciation, clarity, words: [{word, ok, heard}], tips: [] }
    const res = await fetch(env('STT_API_URL'), { method: 'POST', headers: { Authorization: `Bearer ${env('STT_API_KEY')}` }, body: await req.formData() });
    if (!res.ok) return json({ error: 'upstream' }, 502);
    return json(await res.json());
  }

  return json({ error: 'not_found' }, 404);
});
