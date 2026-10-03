/**
 * Associação de palavras: toque numa palavra da esquerda e no significado da direita.
 * Par certo fica marcado; par errado pisca e conta como erro.
 * Termina quando todos os pares forem feitos. Sem erros = acerto.
 */
import { h } from '../../core/dom.js';
import { shuffle, Header } from './shared.js';

export function MatchExercise({ exercise, lang, onAnswer }) {
  const left = shuffle(exercise.pairs.map(([a, b], i) => ({ i, label: a })));
  const right = shuffle(exercise.pairs.map(([a, b], i) => ({ i, label: b })));
  let selected = null; // { side, item, el }
  let mistakes = 0;
  let done = 0;
  const wrongPairs = [];

  const make = (item, side) => {
    const el = h('button', { class: 'match__item', type: 'button', lang: side === 'left' ? lang.tag : 'pt-BR' }, item.label);
    el.addEventListener('click', () => pick(item, side, el));
    return el;
  };

  function pick(item, side, el) {
    if (el.disabled) return;
    if (!selected || selected.side === side) {
      selected?.el.classList.remove('is-selected');
      selected = { side, item, el };
      el.classList.add('is-selected');
      return;
    }
    const a = selected;
    selected = null;
    a.el.classList.remove('is-selected');
    if (a.item.i === item.i) {
      [a.el, el].forEach((x) => { x.classList.add('is-matched'); x.disabled = true; });
      done += 1;
      if (done === exercise.pairs.length) {
        onAnswer({
          correct: mistakes === 0,
          given: mistakes ? `${mistakes} ${mistakes === 1 ? 'par errado' : 'pares errados'}: ${wrongPairs.join(', ')}` : 'todos os pares',
          expected: exercise.answer,
        });
      }
    } else {
      mistakes += 1;
      const [l, r] = side === 'left' ? [item, a.item] : [a.item, item];
      wrongPairs.push(`${l.label} ≠ ${r.label}`);
      [a.el, el].forEach((x) => {
        x.classList.add('is-wrong');
        setTimeout(() => x.classList.remove('is-wrong'), 600);
      });
    }
  }

  return h('div', { class: 'ex' },
    ...Header(exercise, h('p', { class: 'ex__prompt ex__prompt--sm' }, exercise.prompt)),
    h('div', { class: 'match' },
      h('div', { class: 'match__col' }, left.map((it) => make(it, 'left'))),
      h('div', { class: 'match__col' }, right.map((it) => make(it, 'right'))),
    ),
  );
}
