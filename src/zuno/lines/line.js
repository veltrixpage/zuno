/**
 * Uma fala do Zuno em todos os idiomas do app.
 * Ordem: pt, en, es, it, fr, de, ja, ko, zh
 * opts.laugh: 'soft' | 'mischievous' | 'big'  → a fala vem com risada
 *
 * Na aula, o Zuno fala no idioma estudado e a tradução em português aparece embaixo.
 */
const ORDER = ['pt', 'en', 'es', 'it', 'fr', 'de', 'ja', 'ko', 'zh'];

export function L(...args) {
  const last = args[args.length - 1];
  const opts = typeof last === 'object' && last !== null ? args.pop() : {};
  const text = {};
  ORDER.forEach((code, i) => { if (args[i]) text[code] = args[i]; });
  return { text, laugh: opts.laugh || null };
}
