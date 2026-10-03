/**
 * Envia eventos de progresso ao Supabase (PostgREST), autenticado com o
 * token da sessão. Requer supabase/schema.sql aplicado no projeto.
 */
import { session, local } from '../../../core/storage.js';

const token = () => (session.get('auth.session') || local.get('auth.session'))?.token;

export function createSupabaseSync({ url, anonKey }) {
  const rest = `${url.replace(/\/$/, '')}/rest/v1`;

  async function call(path, body, prefer) {
    const t = token();
    if (!t) throw new Error('sem sessão');
    const res = await fetch(rest + path, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${t}`,
        'Content-Type': 'application/json',
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`supabase ${res.status}`);
  }

  return {
    async send({ type, payload }) {
      if (type === 'language_added') {
        // user_id é preenchido pelo default auth.uid() no banco
        return call('/user_languages', { language_code: payload.code, current_level: payload.level }, 'resolution=ignore-duplicates');
      }
      if (type === 'lesson_completed') {
        await call('/rpc/complete_lesson', {
          p_lesson_id: payload.lessonId,
          p_correct: payload.correct,
          p_total: payload.total,
          p_seconds: payload.seconds,
          p_words: payload.words,
        });
        return call('/rpc/record_answers', { p_answers: payload.answers || [], p_hard: Boolean(payload.hard), p_review: false });
      }
      if (type === 'review_completed') {
        return call('/rpc/record_answers', { p_answers: payload.answers || [], p_hard: false, p_review: true });
      }
      if (type === 'preferences_changed') {
        return call('/rpc/set_preferences', {
          p_personality: payload.personality,
          p_reduce_motion: payload.reduceMotion,
          p_show_translation: payload.showTranslation,
          p_sound: payload.sound,
          p_hard_mode: Boolean(payload.hardMode),
        });
      }
      if (type === 'ai_session_saved') {
        const x = payload.session;
        await call('/chat_sessions', {
          id: x.id, kind: x.kind, language_code: x.code, level: x.level, topic: x.topic, situation: x.situation,
          summary: x.summary, words: x.words, difficulty: x.difficulty, goal_done: x.goalDone, updated_at: x.updatedAt,
        }, 'resolution=merge-duplicates');
        const msgs = (x.turns || []).filter((t) => t.role === 'user' || t.role === 'zuno').map((t) => ({
          session_id: x.id, role: t.role, text: t.text, translation: t.translation || null, correction: t.correction || null, teach: t.teach || null,
        }));
        return msgs.length ? call('/chat_messages', msgs) : undefined;
      }
      if (type === 'placement_saved') {
        return call('/rpc/save_placement', { p_language: payload.code, p_placement: payload.placement });
      }
      if (type === 'zuno_state') {
        return call('/rpc/record_answers', { p_answers: [], p_zuno_state: payload.state });
      }
      return undefined;
    },
  };
}
