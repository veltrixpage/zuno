/**
 * Voz do Zuno (Text-to-Speech) nos 9 idiomas do app.
 *
 * Ordem:
 *   1. Voz própria do Zuno na nuvem → só se o SERVIDOR disser tts: true
 *      (POST {apiBase}/tts; a chave do serviço de voz fica no servidor).
 *   2. Voz do próprio aparelho (Web Speech API) → real, sem chave, mas é a
 *      voz do sistema, não a do Zuno.
 *   3. Nenhuma → os botões de áudio somem (nada é fingido).
 *
 * A personalidade influencia a fala: Light tranquilo, Provocador brincalhão,
 * Ofensivo teatral e debochado. No aparelho isso vira velocidade/tom;
 * na nuvem, vira o "estilo" pedido ao serviço de voz.
 */
import { SpeechService } from '../audio/SpeechService.js';
import { backendStatus, apiUrl, authToken } from '../ai/backendStatus.js';

export const VOICE_PROFILES = {
  light: { style: 'calm', rate: 0.95, pitch: 1.0 },
  provocador: { style: 'playful', rate: 1.05, pitch: 1.15 },
  ofensivo: { style: 'theatrical', rate: 1.08, pitch: 0.85 },
};

let current = null;

export const VoiceService = {
  async status(code) {
    const s = await backendStatus();
    return { cloud: s.tts, device: SpeechService.canSpeak(code) };
  },

  /**
   * Fala um texto. `slow` = 🐢 falar mais devagar.
   * Devolve 'cloud' | 'device' | false.
   */
  async speak(text, code, { slow = false, personality = 'light' } = {}) {
    const profile = VOICE_PROFILES[personality] || VOICE_PROFILES.light;
    const s = await backendStatus();
    if (s.tts) {
      try {
        const res = await fetch(apiUrl('/tts'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(authToken() ? { Authorization: `Bearer ${authToken()}` } : {}) },
          body: JSON.stringify({ text, language: code, style: profile.style, slow }),
        });
        if (res.ok) {
          current?.pause();
          current = new Audio(URL.createObjectURL(await res.blob()));
          await current.play();
          return 'cloud';
        }
      } catch { /* cai para a voz do aparelho */ }
    }
    if (SpeechService.canSpeak(code)) {
      SpeechService.speak(text, code, { rate: (slow ? 0.6 : 0.92) * profile.rate, pitch: profile.pitch });
      return 'device';
    }
    return false;
  },

  stop() {
    current?.pause();
    SpeechService.stop();
  },
};
