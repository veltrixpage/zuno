/**
 * Ícones próprios do Zuno (traço 1.75, cantos arredondados).
 * Retornam nós SVG prontos.
 */
import { svg } from '../core/dom.js';

const wrap = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const paths = {
  home: '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
  learn: '<path d="M4 6.5C4 5.7 4.7 5 5.5 5H10a2 2 0 0 1 2 2v12a1.5 1.5 0 0 0-1.5-1.5h-5A1.5 1.5 0 0 1 4 16z"/><path d="M20 6.5c0-.8-.7-1.5-1.5-1.5H14a2 2 0 0 0-2 2v12a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 0 20 16z"/>',
  world: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4c2.2 2.3 3.2 5 3.2 8s-1 5.7-3.2 8c-2.2-2.3-3.2-5-3.2-8s1-5.7 3.2-8z"/>',
  progress: '<path d="M5 19V13"/><path d="M10 19V9"/><path d="M15 19v-4"/><path d="M20 19V6"/>',
  profile: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5"/>',
  flame: '<path d="M12 20c3.3 0 6-2.4 6-5.8 0-3.5-2.6-5.5-3.6-8.7-.2-.6-.9-.7-1.2-.2-.8 1.3-1.1 2.6-1.2 3.6-1-.8-1.6-1.9-1.8-2.8-.1-.5-.8-.7-1.1-.2C7.6 8.1 6 10.6 6 14.2 6 17.6 8.7 20 12 20z"/>',
  bolt: '<path d="M13 3 5.5 13.2a.5.5 0 0 0 .4.8H11l-1 7 7.5-10.2a.5.5 0 0 0-.4-.8H12z"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.2l2.8 1.8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  eyeOff: '<path d="M4 4l16 16"/><path d="M9.9 6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.7M6.4 7.6A16.3 16.3 0 0 0 2.5 12S6 18.5 12 18.5c1.5 0 2.9-.4 4.1-1"/><path d="M10 10a2.8 2.8 0 0 0 4 4"/>',
  logout: '<path d="M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4"/><path d="M10 16l-4-4 4-4M6 12h9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  chevronRight: '<path d="M9 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  words: '<path d="M5 6.5h9M5 11h14M5 15.5h7"/><path d="M16 15l2 2 3.5-4"/>',
  lessons: '<circle cx="12" cy="12" r="8"/><path d="M8.5 12.2l2.4 2.4 4.6-5"/>',
  star: '<path d="M12 4.5l2.2 4.6 5 .6-3.7 3.5.9 5L12 15.8 7.6 18.2l.9-5L4.8 9.7l5-.6z"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
};

export const icon = (name) => svg(wrap(paths[name] || ''));
