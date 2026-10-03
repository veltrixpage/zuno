/**
 * <ZunoCompanion>: o Zuno que acompanha as aulas, como professor e companheiro.
 *
 * Presença semelhante (na aparência e na posição) a um elemento flutuante
 * fixo na lateral, mas NÃO é botão, NÃO abre menu, NÃO tem função de sistema,
 * sem ícones por cima e sem tooltip. Vive numa coluna própria à ESQUERDA,
 * reservada no grid do LessonLayout: nunca cobre pergunta, respostas ou botões.
 *
 * Fala no idioma estudado, com a tradução em português embaixo.
 * Tudo o que ele "diz" também vai para leitores de tela (aria-live).
 */
import { h } from '../core/dom.js';
import { ZunoCharacter } from './ZunoCharacter.js';
import { Flag } from '../components/flags.js';

const LAUGH_TEXT = { soft: 'Zuno ri baixinho.', mischievous: 'Zuno dá uma risada travessa.', big: 'Zuno gargalha.' };

export function ZunoCompanion({ state = 'neutral', langTag = 'pt', hideTranslation = false, flag = null, evolution = null } = {}) {
  const character = ZunoCharacter({ size: 'companion', state, decorative: true, evolution });

  const text = h('span', { class: 'companion__text', lang: langTag });
  const translation = h('span', { class: 'companion__translation', lang: 'pt-BR' });
  const reveal = h('button', { class: 'companion__reveal', type: 'button' }, 'Ver tradução');
  const laughNote = h('span', { class: 'sr-only' });
  reveal.addEventListener('click', () => { translation.hidden = false; reveal.hidden = true; });

  // Frase no idioma estudado em destaque (com bandeirinha); tradução menor logo abaixo
  const line = h('span', { class: 'companion__line' }, flag && Flag({ country: flag, size: 'sm' }), text);
  const bubble = h('p', { class: 'companion__bubble', 'aria-live': 'polite' }, laughNote, line, translation, reveal);
  bubble.hidden = true;

  const root = h(
    'aside',
    { class: 'companion', 'aria-label': 'Zuno' },
    h('div', { class: 'companion__inner' }, h('div', { class: 'companion__stage' }, character), bubble),
  );

  /** say({ text, translation }, laugh) · say(null) esconde o balão (ele sabe ficar quieto) */
  root.say = (line, laugh = null) => {
    if (!line || !line.text) {
      bubble.hidden = true;
      return;
    }
    laughNote.textContent = laugh ? `${LAUGH_TEXT[laugh]} ` : '';
    text.textContent = line.text;
    translation.textContent = line.translation || '';
    const hasT = Boolean(line.translation);
    translation.hidden = !hasT || hideTranslation;
    reveal.hidden = !hasT || !hideTranslation;
    bubble.dataset.laugh = laugh || '';
    bubble.hidden = false;
    bubble.classList.remove('is-new');
    void bubble.offsetWidth;
    bubble.classList.add('is-new');
  };

  /** Surpresa: cresce um pouco, troca para a arte surpresa e depois volta. */
  let surpriseTimer;
  root.surprise = (after) => {
    const before = after || character.dataset.state || 'neutral';
    clearTimeout(surpriseTimer);
    character.setState('surprised');
    character.play('pop');
    surpriseTimer = setTimeout(() => { if (root.isConnected) character.setState(before === 'surprised' ? 'neutral' : before); }, 2200);
  };

  root.character = character;
  root.setState = (s) => character.setState(s);
  root.look = (t) => character.look(t);
  root.play = (m) => character.play(m);
  return root;
}
