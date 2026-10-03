/**
 * Ordenar palavras: toque nas palavras do banco para montar a frase;
 * toque numa palavra montada para devolvê-la. "Verificar" confere.
 */
import { h } from '../../core/dom.js';
import { shuffle, normalize, Header, bindKeys } from './shared.js';

export function OrderExercise({ exercise, lang, onAnswer }) {
  const bankTokens = shuffle([...exercise.tokens, ...(exercise.distractors || [])]).map((t, i) => ({ t, i }));
  const picked = [];
  let answered = false;

  const line = h('div', { class: 'order__line', 'aria-label': 'Sua frase', lang: lang.tag });
  const bank = h('div', { class: 'order__bank', lang: lang.tag });
  const check = h('button', { class: 'btn btn--primary btn--lg btn--block', type: 'button', disabled: true }, h('span', { class: 'btn__label' }, 'Verificar'));

  function render() {
    line.replaceChildren(...(picked.length
      ? picked.map((tok) => h('button', { class: 'chip chip--picked', type: 'button', disabled: answered, onClick: () => { picked.splice(picked.indexOf(tok), 1); render(); } }, tok.t))
      : [h('span', { class: 'order__hint' }, 'Toque nas palavras abaixo')]));
    bank.replaceChildren(...bankTokens.map((tok) => h('button', {
      class: `chip${picked.includes(tok) ? ' is-used' : ''}`,
      type: 'button',
      disabled: answered || picked.includes(tok),
      'aria-hidden': picked.includes(tok) ? 'true' : null,
      onClick: () => { picked.push(tok); render(); },
    }, tok.t)));
    check.disabled = answered || picked.length === 0;
  }

  check.addEventListener('click', () => {
    if (answered || !picked.length) return;
    answered = true;
    unbind();
    const given = picked.map((p) => p.t).join(exercise.join);
    const correct = normalize(given) === normalize(exercise.answer);
    line.classList.add(correct ? 'is-correct' : 'is-wrong');
    render();
    check.hidden = true;
    onAnswer({ correct, given, expected: exercise.answer });
  });

  let unbind = () => {};

  render();
  const root = h('div', { class: 'ex' },
    ...Header(exercise, h('p', { class: 'ex__prompt ex__prompt--sm', lang: 'pt-BR' }, `“${exercise.prompt}”`)),
    line, bank, check,
  );
  unbind = bindKeys(root, (e) => {
    if (e.key === 'Enter' && !check.disabled) { e.preventDefault(); check.click(); }
  });
  root.destroy = () => unbind();
  return root;
}
