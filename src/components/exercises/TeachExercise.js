/**
 * Passo de ENSINO (não é cobrança): o Zuno apresenta antes de perguntar.
 *  - kind 'grammar': nota curta da unidade (o que vamos aprender e por quê)
 *  - kind 'teach':   palavra/frase nova, com áudio, leitura e tradução logo abaixo
 * Em níveis que o teste de nível já mostrou que você domina, vira "revisão rápida".
 */
import { h } from '../../core/dom.js';
import { VoiceControls } from '../ai/blocks.js';
import { VoiceService } from '../../services/voice/VoiceService.js';
import { Flag } from '../flags.js';
import { bindKeys } from './shared.js';

export function TeachExercise({ exercise, lang, onAnswer, personality = 'light', quick = false, voiceOn = true }) {
  let done = false;
  const next = h('button', { class: 'btn btn--primary btn--lg teach-step__next', type: 'button' }, h('span', { class: 'btn__label' }, exercise.kind === 'grammar' ? 'Começar' : 'Entendi'));
  next.addEventListener('click', () => {
    if (done) return;
    done = true;
    onAnswer({ correct: true, ungraded: true });
  });

  let body;
  if (exercise.kind === 'grammar') {
    body = h('div', { class: 'teach-step teach-step--grammar' },
      h('p', { class: 'ex__instruction' }, 'Nesta unidade'),
      h('h2', { class: 'teach-step__title' }, exercise.title),
      exercise.text && h('p', { class: 'teach-step__text' }, exercise.text),
      exercise.skills && h('ul', { class: 'skill-chips', role: 'list' }, exercise.skills.map((s) => h('li', {}, s))),
    );
  } else {
    body = h('div', { class: `teach-step${quick ? ' is-quick' : ''}` },
      h('p', { class: 'ex__instruction' }, quick ? 'Revisão rápida' : 'Palavra nova'),
      h('p', { class: 'teach-step__target', lang: lang.tag }, Flag({ country: lang.flag, size: 'sm' }), h('span', {}, exercise.target)),
      exercise.reading && h('p', { class: 'teach-step__reading' }, exercise.reading),
      h('p', { class: 'teach-step__translation' }, `“${exercise.translation}”`),
      VoiceControls({ text: exercise.target, lang, personality }),
      !quick && h('p', { class: 'teach-step__hint' }, 'Ouça, repita em voz alta e depois toque em “Entendi”.'),
    );
    // O Zuno fala a palavra nova de verdade
    if (voiceOn) setTimeout(() => body.isConnected && VoiceService.speak(exercise.target, lang.code, { personality }), 350);
  }

  const root = h('div', { class: 'ex' }, body, next);
  bindKeys(root, (e) => { if (e.key === 'Enter' && !e.target.closest?.('input, textarea')) { e.preventDefault(); next.click(); } });
  return root;
}
