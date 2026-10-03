/**
 * Resposta aberta.
 * Correção por IA ainda NÃO está configurada (config/integrations.js).
 * Enquanto isso, conferimos se a resposta usa as palavras-chave esperadas
 * e mostramos um exemplo de resposta. A tela diz isso claramente.
 */
import { h, uniqueId } from '../../core/dom.js';
import { normalize, Header } from './shared.js';
import { isIntegrationReady } from '../../config/integrations.js';

export function OpenExercise({ exercise, lang, onAnswer }) {
  const id = uniqueId('o');
  let answered = false;

  const area = h('textarea', { class: 'field__input open__input', id, rows: '3', lang: lang.tag, placeholder: `Escreva em ${lang.name.toLowerCase()}…` });
  const send = h('button', { class: 'btn btn--primary btn--lg btn--block', type: 'submit', disabled: true }, h('span', { class: 'btn__label' }, 'Enviar resposta'));
  area.addEventListener('input', () => { send.disabled = area.value.trim().length < 3; });

  const note = h('p', { class: 'open__note' },
    isIntegrationReady('aiGrading')
      ? 'Sua resposta será corrigida pela IA.'
      : 'A correção por IA ainda não está ativa. Por enquanto, conferimos as palavras principais e mostramos um exemplo.');

  const form = h('form', { class: 'write', novalidate: true },
    h('label', { class: 'sr-only', for: id }, 'Sua resposta'), area, send);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (answered) return;
    answered = true;
    const given = area.value.trim();
    const text = ` ${normalize(given)} `;
    const groups = exercise.keywords || [];
    const correct = groups.length === 0 || groups.every((g) => g.some((k) => text.includes(` ${normalize(k)}`)));
    area.readOnly = true;
    send.hidden = true;
    onAnswer({ correct, given, expected: exercise.sample });
  });

  return h('div', { class: 'ex' },
    ...Header(exercise, h('p', { class: 'ex__prompt ex__prompt--sm', lang: 'pt-BR' }, exercise.prompt)),
    form, note);
}
