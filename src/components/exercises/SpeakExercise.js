/**
 * Fala: o Zuno fala → você ouve → "Agora você" → grava sua voz (de verdade).
 * A análise de pronúncia só aparece quando o servidor de fala estiver
 * configurado; sem ele, você compara sua gravação com a do Zuno.
 * Não vale ponto (não há como avaliar sem análise), mas faz parte do método.
 */
import { h } from '../../core/dom.js';
import { PronunciationPanel } from '../ai/PronunciationPanel.js';
import { VoiceService } from '../../services/voice/VoiceService.js';

export function SpeakExercise({ exercise, lang, onAnswer, personality = 'light', voiceOn = true }) {
  let done = false;
  const next = h('button', { class: 'btn btn--secondary btn--lg', type: 'button' }, h('span', { class: 'btn__label' }, 'Continuar'));
  next.addEventListener('click', () => {
    if (done) return;
    done = true;
    VoiceService.stop();
    onAnswer({ correct: true, ungraded: true });
  });
  const root = h('div', { class: 'ex' },
    h('p', { class: 'ex__instruction' }, 'Agora você'),
    h('p', { class: 'ex__prompt', lang: lang.tag }, exercise.say),
    exercise.reading && h('p', { class: 'ex__reading' }, exercise.reading),
    exercise.translation && h('p', { class: 'teach-step__translation' }, `“${exercise.translation}”`),
    PronunciationPanel({ text: exercise.say, lang, personality, compact: true }),
    next,
  );
  if (voiceOn) setTimeout(() => root.isConnected && VoiceService.speak(exercise.say, lang.code, { personality }), 400);
  return root;
}
