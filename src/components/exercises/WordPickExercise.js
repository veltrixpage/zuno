/** Identificação de palavra: toque na palavra certa dentro da frase. */
import { h } from '../../core/dom.js';
import { normalize, Header } from './shared.js';

export function WordPickExercise({ exercise, lang, onAnswer }) {
  let answered = false;
  const words = exercise.sentence.split(/\s+/);
  const buttons = words.map((w) => {
    const b = h('button', { class: 'pick', type: 'button' }, w);
    b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = normalize(w) === normalize(exercise.target);
      buttons.forEach((x) => {
        x.disabled = true;
        if (normalize(x.textContent) === normalize(exercise.target)) x.classList.add('is-correct');
      });
      if (!correct) b.classList.add('is-wrong');
      onAnswer({ correct, given: w, expected: exercise.target });
    });
    return b;
  });

  return h('div', { class: 'ex' },
    ...Header(exercise, h('p', { class: 'ex__prompt ex__prompt--sm', lang: 'pt-BR' }, exercise.prompt)),
    h('p', { class: 'pick-line', lang: lang.tag }, buttons),
  );
}
