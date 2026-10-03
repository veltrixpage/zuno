/** Utilidades compartilhadas pelos componentes de exercício. */
import { h } from '../../core/dom.js';

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Compara respostas digitadas: ignora maiúsculas, acentos, pontuação e espaços extras. */
export function normalize(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[.,!?¡¿;:"“”«»。、！？]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove a leitura entre parênteses do fim: "おはよう (ohayō)" → "おはよう" */
export const stripReading = (s) => String(s).replace(/\s*\([^)]*\)\s*$/, '');

/** Frase completa a partir de um enunciado com lacuna: "I ___ a student." + "am" */
export function fillBlank(prompt, word) {
  return String(prompt).replace('___', stripReading(word)).replace(/\s*\(\d+\)\s*$/, '').replace(/\s+([.!?。？])/g, '$1');
}

/** Mostra "___" como uma lacuna desenhada. */
export function promptWithBlank(text, fill, cls = '') {
  const parts = String(text).split('___');
  if (parts.length === 1) return [text];
  const blank = h('span', { class: `blank${fill ? ' is-filled' : ''} ${cls}`.trim() }, fill || '    ');
  return [parts[0], blank, ...parts.slice(1)];
}

/** Liga um atalho de teclado que se desliga sozinho quando o exercício sai da tela. */
export function bindKeys(root, handler) {
  function onKey(e) {
    if (!root.isConnected) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    handler(e);
  }
  document.addEventListener('keydown', onKey);
  return () => document.removeEventListener('keydown', onKey);
}

/** Bloco padrão: instrução + pergunta (+ leitura). */
export function Header(exercise, promptNode) {
  return [
    h('p', { class: 'ex__instruction' }, exercise.instruction),
    h('div', { class: 'ex__question' },
      promptNode,
      exercise.reading && h('p', { class: 'ex__reading' }, exercise.reading),
    ),
  ];
}
