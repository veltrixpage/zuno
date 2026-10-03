/**
 * Layout das telas de aprendizado.
 * Reserva uma coluna própria à ESQUERDA para o Zuno (ZunoCompanion),
 * garantindo que ele nunca cubra pergunta, respostas, botões ou textos.
 *
 *  ┌──────────┬──────────────────────────┐
 *  │  Zuno    │  pergunta                │
 *  │ (fixo)   │  respostas               │
 *  │  balão   │  feedback                │
 *  └──────────┴──────────────────────────┘
 *  Celular: o Zuno fica à esquerda numa faixa própria, com o balão ao lado.
 */
import { h } from '../core/dom.js';
import { ZunoCompanion } from '../zuno/ZunoCompanion.js';

export function LessonLayout({ state, header, body, langTag, hideTranslation, message, flag, evolution }) {
  const companion = ZunoCompanion({ state, langTag, hideTranslation, flag, evolution });
  if (message) companion.say({ text: message });
  const root = h(
    'div',
    { class: 'lesson' },
    companion,
    h('section', { class: 'lesson__main' },
      header && h('div', { class: 'lesson__header' }, header),
      h('div', { class: 'lesson__body' }, body),
    ),
  );
  root.companion = companion;
  return root;
}
