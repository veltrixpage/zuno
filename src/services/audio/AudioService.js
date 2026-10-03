/**
 * Sons do Zuno (risadas e efeitos).
 *
 * Os arquivos de áudio ainda não existem. Cada som tem uma entrada aqui com
 * `src: null`; enquanto for null, nada toca (sem fingir). Quando os arquivos
 * chegarem, basta preencher `src` (ex.: '/audio/laugh-mischievous.mp3').
 *
 * Tipos de risada:
 *   laugh_soft         → risada leve (Light, raramente)
 *   laugh_mischievous  → risada travessa (Provocador)
 *   laugh_big          → risada exagerada, quase maliciosa (Ofensivo)
 */
export const SOUNDS = {
  laugh_soft: { src: null, volume: 0.6 },
  laugh_mischievous: { src: null, volume: 0.7 },
  laugh_big: { src: null, volume: 0.8 },
  surprise: { src: null, volume: 0.6 },
  celebrate: { src: null, volume: 0.6 },
  sleep: { src: null, volume: 0.5 },
  frustration: { src: null, volume: 0.5 },
  correct: { src: null, volume: 0.5 },
  wrong: { src: null, volume: 0.5 },
};

/**
 * Sons por personalidade: a mesma reação soa diferente em cada uma.
 * Ex.: PERSONALITY_SOUNDS.ofensivo.laugh → 'laugh_big'.
 * Para variações próprias, crie novas chaves em SOUNDS (ex.: 'surprise_ofensivo').
 */
export const PERSONALITY_SOUNDS = {
  light: { laugh: 'laugh_soft', surprise: 'surprise', celebrate: 'celebrate', sleep: 'sleep', frustration: 'frustration' },
  provocador: { laugh: 'laugh_mischievous', surprise: 'surprise', celebrate: 'celebrate', sleep: 'sleep', frustration: 'frustration' },
  ofensivo: { laugh: 'laugh_big', surprise: 'surprise', celebrate: 'celebrate', sleep: 'sleep', frustration: 'frustration' },
};

const cache = new Map();

export const AudioService = {
  /** Há algum som real configurado? (a tela usa isso para mostrar o ajuste de som) */
  hasAnySound: () => Object.values(SOUNDS).some((s) => s.src),

  isAvailable: (key) => Boolean(SOUNDS[key]?.src),

  async play(key, { enabled = true } = {}) {
    const sound = SOUNDS[key];
    if (!enabled || !sound?.src) return false;
    try {
      let audio = cache.get(key);
      if (!audio) {
        audio = new Audio(sound.src);
        audio.volume = sound.volume;
        cache.set(key, audio);
      }
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch {
      return false; // navegador bloqueou ou arquivo indisponível
    }
  },
};
