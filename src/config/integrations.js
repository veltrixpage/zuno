/**
 * Integrações externas (IA, voz do Zuno, reconhecimento de fala).
 *
 * NENHUMA está configurada ainda, e o app não finge que estão.
 * Regras:
 *  - Nunca colocar chaves de API no frontend.
 *  - O app só conhece o endereço de um backend próprio (ZUNO_API_BASE),
 *    definido por variável de ambiente no build:
 *        ZUNO_API_BASE=https://api.seudominio.com npm run build
 *  - As chaves (OpenAI, ElevenLabs, Google etc.) ficam só nesse backend.
 */
/* global __ZUNO_API_BASE__ */
const API_BASE = typeof __ZUNO_API_BASE__ !== 'undefined' ? __ZUNO_API_BASE__ : '';

export const INTEGRATIONS = Object.freeze({
  apiBase: API_BASE,
  // Correção de respostas abertas por IA: POST {apiBase}/ai/grade
  aiGrading: false,
  // Voz própria do Zuno (TTS na nuvem): POST {apiBase}/tts
  zunoVoice: false,
  // Reconhecimento de fala (atividades de falar): POST {apiBase}/stt
  speechRecognition: false,
});

export const isIntegrationReady = (name) => Boolean(INTEGRATIONS[name]);
