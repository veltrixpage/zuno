/**
 * Escrita: completar digitando ou traduzir digitando.
 * A conferência ignora maiúsculas, acentos e pontuação.
 */
import { h, uniqueId } from '../../core/dom.js';
import { normalize, promptWithBlank, Header } from './shared.js';

export function WriteExercise({ exercise, lang, onAnswer }) {
  const id = uniqueId('w');
  let answered = false;
  const typed = exercise.typedTranslation;

  const promptEl = h('p', { class: 'ex__prompt', lang: typed ? 'pt-BR' : lang.tag }, typed ? `“${exercise.prompt}”` : promptWithBlank(exercise.prompt));
  const input = h('input', {
    class: 'field__input write__input', id, type: 'text', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false',
    lang: lang.tag, placeholder: typed ? `Escreva em ${lang.name.toLowerCase()}` : 'Escreva a palavra que falta',
  });
  const check = h('button', { class: 'btn btn--primary btn--lg btn--block', type: 'submit', disabled: true }, h('span', { class: 'btn__label' }, 'Verificar'));
  input.addEventListener('input', () => { check.disabled = !input.value.trim(); });

  const form = h('form', { class: 'write', novalidate: true },
    h('label', { class: 'sr-only', for: id }, 'Sua resposta'),
    input, check,
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (answered || !input.value.trim()) return;
    answered = true;
    const given = input.value.trim();
    const correct = exercise.accept.some((a) => normalize(a) === normalize(given));
    input.readOnly = true;
    input.classList.add(correct ? 'is-correct' : 'is-wrong');
    check.hidden = true;
    if (!typed) promptEl.replaceChildren(...promptWithBlank(exercise.prompt, exercise.answer));
    onAnswer({ correct, given, expected: exercise.answer });
  });

  // foco sem rolar a tela no celular
  setTimeout(() => { if (form.isConnected && window.matchMedia('(hover: hover)').matches) input.focus({ preventScroll: true }); }, 200);

  return h('div', { class: 'ex' }, ...Header(exercise, promptEl), form);
}
