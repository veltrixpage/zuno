/**
 * Leitura em voz alta para "escutar e responder".
 *
 * Usa a voz do próprio dispositivo (Web Speech API, sem chave e sem servidor).
 * Se o dispositivo não tiver voz para o idioma, `canSpeak` devolve false e a
 * atividade mostra o texto em vez do áudio. Nada é simulado.
 *
 * Voz própria do Zuno / TTS na nuvem: ver config/integrations.js (ainda não configurado).
 */
const LANG_TAGS = { en: 'en-US', es: 'es-ES', it: 'it-IT', fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP', ko: 'ko-KR', zh: 'zh-CN', pt: 'pt-PT' };

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

function voices() {
  try { return synth ? synth.getVoices() : []; } catch { return []; }
}

// Algumas plataformas carregam as vozes depois.
if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = () => {};

export const SpeechService = {
  supported: () => Boolean(synth && typeof window.SpeechSynthesisUtterance === 'function'),

  canSpeak(code) {
    if (!this.supported()) return false;
    const tag = LANG_TAGS[code] || code;
    const list = voices();
    // Se a lista ainda não carregou, tentamos mesmo assim (o navegador escolhe a voz).
    return list.length === 0 || list.some((v) => v.lang?.toLowerCase().startsWith(tag.slice(0, 2)));
  },

  speak(text, code, { rate = 0.9, pitch = 1 } = {}) {
    if (!this.supported()) return false;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = LANG_TAGS[code] || code;
      u.rate = rate;
      u.pitch = pitch;
      const match = voices().find((v) => v.lang?.toLowerCase().startsWith(u.lang.slice(0, 2).toLowerCase()));
      if (match) u.voice = match;
      synth.speak(u);
      return true;
    } catch {
      return false;
    }
  },

  stop() {
    try { synth?.cancel(); } catch { /* nada */ }
  },
};
