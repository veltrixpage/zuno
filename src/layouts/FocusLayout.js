/**
 * Layout de foco (aulas): sem menu, sem barra inferior.
 * A própria página desenha o topo com "fechar" e o progresso da aula.
 */
import { h } from '../core/dom.js';

export const FocusLayout = (page) => h('div', { class: 'focus-shell' }, h('main', { class: 'focus-shell__main', id: 'main' }, page));
