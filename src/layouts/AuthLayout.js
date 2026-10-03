/**
 * Layout das telas de entrada (login, cadastro, recuperar senha).
 * Celular: Zuno flutuando no topo, formulário abaixo.
 * Tablet/desktop: palco do Zuno à esquerda, formulário à direita.
 */
import { h } from '../core/dom.js';
import { ZunoCharacter } from '../zuno/ZunoCharacter.js';
import { Wordmark } from '../components/ui.js';
import { APP } from '../config/app.config.js';

export function AuthLayout(content, { compactZuno = false } = {}) {
  const stage = h(
    'div',
    { class: 'auth__stage' },
    ZunoCharacter({ size: compactZuno ? 'lg' : 'xl', className: 'auth__zuno' }),
    h('div', { class: 'auth__brand' }, Wordmark({ size: 'lg' }), h('p', { class: 'auth__tagline' }, APP.tagline)),
  );

  return h(
    'div',
    { class: 'auth' },
    stage,
    h('main', { class: 'auth__panel', id: 'main' }, h('div', { class: 'auth__card' }, content)),
  );
}
