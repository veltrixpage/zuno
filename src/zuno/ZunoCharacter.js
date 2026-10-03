/**
 * <ZunoCharacter>: o personagem oficial, sempre flutuando.
 *
 * Estrutura:
 *   .zuno                  (caixa que reserva espaço; nunca se sobrepõe)
 *     .zuno__body          (levitação contínua, lenta e orgânica)
 *       .zuno__look        (para onde ele olha: pergunta, resposta, usuário)
 *         .zuno__pose      (postura do estado emocional + reações curtas)
 *           img.zuno__art  (recorte oficial, fundo transparente)
 *     .zuno__shadow        (sombra no "ar": ele nunca toca o chão)
 *
 * Não é botão: não recebe foco, não abre nada, não tem ícones por cima.
 */
import { h } from '../core/dom.js';
import { ZUNO_STATES, resolveZunoArt, preloadZunoArt } from './zuno.states.js';
import { Flag } from '../components/flags.js';

/** Acessórios da evolução: flutuam AO REDOR do Zuno, nunca mudam o personagem. */
const ORBIT = { estrela: '★', livro: '📖', chama: '🔥', poliglota: '🌐', perfeito: '🏅', coroa: '👑' };

const MOTION_MS = { celebrate: 1300, shake: 700, pop: 700, laugh: 1000, 'laugh-big': 1500 };

export function ZunoCharacter({ size = 'md', state = 'neutral', decorative = false, className = '', evolution = null } = {}) {
  const meta = ZUNO_STATES[state] || ZUNO_STATES.neutral;

  const img = h('img', {
    class: 'zuno__art',
    src: resolveZunoArt(state),
    alt: decorative ? '' : meta.label,
    draggable: 'false',
    decoding: 'async',
  });

  const root = h(
    'div',
    {
      class: `zuno zuno--${size} ${className}`.trim(),
      dataset: { state, float: meta.float },
      'aria-hidden': decorative ? 'true' : null,
    },
    h('div', { class: 'zuno__body' }, h('div', { class: 'zuno__look' }, h('div', { class: 'zuno__pose' }, img))),
    h('div', { class: 'zuno__shadow', 'aria-hidden': 'true' }),
  );

  // Evolução: acessórios em órbita + variações (aura, brilho, giro)
  if (evolution?.equipped?.length) {
    const eq = new Set(evolution.equipped);
    const items = [...eq].filter((id) => ORBIT[id]).map((id) => h('span', { class: 'zuno__acc', title: id }, ORBIT[id]));
    if (eq.has('bandeira') && evolution.flag) items.push(h('span', { class: 'zuno__acc zuno__acc--flag' }, Flag({ country: evolution.flag, size: 'sm' })));
    if (items.length) root.insertBefore(h('div', { class: 'zuno__orbit', 'aria-hidden': 'true' }, items.slice(0, 4)), root.firstChild);
    ['aura', 'aura-dourada', 'brilho', 'giro'].forEach((v) => eq.has(v) && root.classList.add(`has-${v}`));
  }

  root.setState = (next) => {
    const m = ZUNO_STATES[next] || ZUNO_STATES.neutral;
    root.dataset.state = next;
    root.dataset.float = m.float;
    const src = resolveZunoArt(next);
    preloadZunoArt([next]);
    if (img.getAttribute('src') !== src) img.src = src;
    if (!decorative) img.alt = m.label;
  };

  /** Olhar: 'question' | 'answer' | 'user' (frente) */
  root.look = (target) => {
    if (!target || target === 'user') root.removeAttribute('data-look');
    else root.dataset.look = target;
  };

  let timer;
  /** Toca uma reação curta e volta ao normal sozinho. */
  root.play = (motion) => {
    if (!motion) return;
    clearTimeout(timer);
    root.removeAttribute('data-motion');
    void root.offsetWidth; // reinicia a animação
    root.dataset.motion = motion;
    timer = setTimeout(() => root.removeAttribute('data-motion'), MOTION_MS[motion] || 1000);
  };

  return root;
}
