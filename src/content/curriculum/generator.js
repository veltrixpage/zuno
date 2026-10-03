/**
 * Gera as aulas de um idioma a partir do banco (bank.js).
 *
 * Método do Zuno (ensinar antes de cobrar):
 *   ensino → exemplo/escuta → tentativa → correção → repetição → aplicação
 *
 * Direção das perguntas, de forma progressiva:
 *   1ª aula da unidade: PORTUGUÊS → IDIOMA (produzir)
 *   aulas seguintes:    + IDIOMA → PORTUGUÊS (entender)
 *   revisão / níveis acima: + IDIOMA → IDIOMA (ouvir e reconhecer, montar, escrever)
 */
import { BANK, JAPANESE_EXTRA } from './bank.js';
import { BANK_ORDER, LEVEL_INFO } from './levels.js';

const LATIN = new Set(['en', 'es', 'it', 'fr', 'de', 'pt']);
const LANG_NAME = { en: 'inglês', es: 'espanhol', it: 'italiano', fr: 'francês', de: 'alemão', ja: 'japonês', ko: 'coreano', zh: 'mandarim', pt: 'português' };
const SRC_NAME = { pt: 'português', en: 'inglês' };

/** Pequeno gerador pseudoaleatório estável (mesma aula sempre igual). */
function seeded(seed) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function parseCell(cell) {
  const [text, reading] = String(cell).split('|');
  return { text: text.trim(), reading: reading ? reading.trim() : null };
}

/** Converte uma linha do banco para { src, tgt, reading } no idioma pedido. */
function toItem(row, code) {
  const srcCode = code === 'pt' ? 'en' : 'pt';
  const src = parseCell(row[BANK_ORDER.indexOf(srcCode)]).text;
  const t = parseCell(row[BANK_ORDER.indexOf(code)]);
  return { src, tgt: t.text, reading: t.reading };
}

/** Rótulo de opção: com leitura nos níveis iniciais (ex.: “ありがとう (arigatō)”). */
const withReading = (item, show) => (show && item.reading ? `${item.tgt} (${item.reading})` : item.tgt);

/** Divide uma frase em blocos para “monte a frase”. */
function tokens(text, code) {
  const clean = text.replace(/[。？！?!.,、]+$/u, '');
  if (code === 'ja' || code === 'zh') {
    const chars = [...clean];
    if (chars.length < 4) return null;
    const n = chars.length > 8 ? 4 : 3;
    const size = Math.ceil(chars.length / n);
    const out = [];
    for (let i = 0; i < chars.length; i += size) out.push(chars.slice(i, i + size).join(''));
    return out.length > 1 ? out : null;
  }
  const parts = clean.split(/\s+/);
  return parts.length >= 3 ? parts : null;
}

function pickOthers(pool, item, n, rnd) {
  const others = pool.filter((p) => p.tgt !== item.tgt && p.src !== item.src);
  const out = [];
  while (others.length && out.length < n) out.push(others.splice(Math.floor(rnd() * others.length), 1)[0]);
  return out;
}

/** Cria a lista de unidades (com aulas e exercícios) de um nível para um idioma. */
export function buildLevel(code, cefr, { legacyUnit = null } = {}) {
  const levelId = `${code}-${cefr.toLowerCase()}`;
  const showReading = cefr === 'A1' || cefr === 'A2';
  const langName = LANG_NAME[code];
  const srcName = SRC_NAME[code === 'pt' ? 'en' : 'pt'];

  // Unidades do banco + unidades próprias do japonês, na ordem certa
  let units = (BANK[cefr] || []).map((u) => ({ ...u, items: u.items.map((r) => toItem(r, code)) }));
  if (code === 'ja' && JAPANESE_EXTRA[cefr]) {
    for (const extra of JAPANESE_EXTRA[cefr]) {
      const unit = { ...extra, items: extra.items.map(([src, tgt, reading]) => ({ src, tgt, reading })) };
      const at = extra.after ? units.findIndex((u) => u.slug === extra.after) + 1 : 0;
      units.splice(at > 0 ? at : (extra.after ? units.length : 0), 0, unit);
    }
  }
  const levelPool = units.flatMap((u) => u.items);

  const built = units.map((unit, ui) => {
    const unitId = `${levelId}-${unit.slug}`;
    const pool = unit.items.length >= 4 ? unit.items : levelPool;
    const ask = unit.ask || {
      produce: `Como se diz “{src}” em ${langName}?`,
      reverse: `Como se diz “{tgt}” em ${srcName}?`,
    };
    const chunks = [];
    for (let i = 0; i < unit.items.length; i += 3) chunks.push(unit.items.slice(i, i + 3));
    if (chunks.length > 1 && chunks[chunks.length - 1].length === 1) chunks[chunks.length - 2].push(...chunks.pop());

    const lessons = chunks.map((chunk, li) => {
      const id = `${unitId}-l${li + 1}`;
      const rnd = seeded(id);
      const ex = [];
      const opts = (item) => [item, ...pickOthers(pool, item, 3, rnd)];

      if (li === 0) ex.push({ type: 'teach', kind: 'grammar', title: unit.title, text: unit.grammar, skills: unit.skills });

      // 1) ENSINO + TENTATIVA (português → idioma)
      for (const item of chunk) {
        ex.push({ type: 'teach', kind: 'teach', target: item.tgt, reading: item.reading, translation: item.src });
        ex.push({
          kind: 'translate', instruction: 'Agora você', prompt: ask.produce.replace('{src}', item.src),
          options: opts(item).map((o) => withReading(o, showReading)),
        });
      }
      // 2) DIREÇÃO CONTRÁRIA (idioma → português), a partir da 2ª aula ou do A2
      if (li >= 1 || cefr !== 'A1') {
        for (const item of chunk.slice(0, 2)) {
          ex.push({
            kind: 'meaning', instruction: 'O que significa?', prompt: ask.reverse.replace('{tgt}', item.tgt), reading: showReading ? item.reading : null,
            options: opts(item).map((o) => o.src),
          });
        }
      }
      // 3) ESCUTA (idioma → idioma): ouvir e reconhecer a forma escrita
      if (li >= 1 || cefr !== 'A1') {
        const item = chunk[chunk.length - 1];
        ex.push({ kind: 'listen', instruction: 'Escute e responda', prompt: 'Qual destas você ouviu?', say: item.tgt, options: opts(item).map((o) => withReading(o, showReading)) });
      }
      // 4) FALA: o Zuno fala, você repete (gravação real; análise quando configurada)
      const speakItem = chunk.find((i) => i.tgt.length > 2) || chunk[0];
      ex.push({ type: 'speak', say: speakItem.tgt, reading: showReading ? speakItem.reading : null, translation: speakItem.src });
      // 5) APLICAÇÃO: montar a frase / escrever
      const phrase = chunk.find((i) => tokens(i.tgt, code));
      if (phrase && li >= 1) ex.push({ type: 'order', translation: phrase.src, tokens: tokens(phrase.tgt, code), join: code === 'ja' || code === 'zh' ? '' : ' ' });
      if (LATIN.has(code) && li >= 1 && !unit.ask) {
        const w = chunk[0];
        ex.push({ type: 'translate', prompt: w.src, accept: [w.tgt] });
      }

      return {
        id, order: li + 1,
        title: chunk.map((c) => c.tgt).slice(0, 3).join(' · '),
        words: chunk.map((c) => c.tgt),
        exercises: ex,
      };
    });

    // REVISÃO DA UNIDADE: mistura todas as direções e habilidades
    const rid = `${unitId}-l${lessons.length + 1}`;
    const rnd = seeded(rid);
    const items = [...unit.items].sort(() => rnd() - 0.5);
    const review = [];
    review.push({ type: 'match', pairs: items.slice(0, 4).map((i) => [i.tgt, i.src]) });
    for (const item of items.slice(0, 2)) review.push({ kind: 'translate', instruction: 'Como se diz?', prompt: ask.produce.replace('{src}', item.src), options: [item, ...pickOthers(pool, item, 3, rnd)].map((o) => withReading(o, showReading)) });
    for (const item of items.slice(2, 4)) review.push({ kind: 'meaning', instruction: 'O que significa?', prompt: ask.reverse.replace('{tgt}', item.tgt), options: [item, ...pickOthers(pool, item, 3, rnd)].map((o) => o.src) });
    const li = items[4] || items[0];
    review.push({ kind: 'listen', instruction: 'Escute e responda', prompt: 'Qual destas você ouviu?', say: li.tgt, options: [li, ...pickOthers(pool, li, 3, rnd)].map((o) => withReading(o, showReading)) });
    const passage = items.slice(0, 3);
    review.push({
      kind: 'reading', passage: passage.map((p) => p.tgt).join(code === 'ja' || code === 'zh' ? '　' : ' · '),
      question: 'Qual destas ideias aparece no texto?',
      options: [passage[1].src, ...pickOthers(pool, passage[1], 3, rnd).filter((o) => !passage.includes(o)).map((o) => o.src)].slice(0, 4),
    });
    if (LATIN.has(code) && !unit.ask) review.push({ type: 'translate', prompt: items[1].src, accept: [items[1].tgt] });
    review.push({ type: 'speak', say: items[0].tgt, reading: showReading ? items[0].reading : null, translation: items[0].src });

    lessons.push({ id: rid, order: lessons.length + 1, title: `Revisão: ${unit.title}`, words: [], exercises: review, review: true });

    return { id: unitId, order: ui + 1, title: unit.title, skills: unit.skills, grammar: unit.grammar, lessons };
  });

  // A unidade escrita à mão nos Prompts 2–3 entra depois de “Apresentações” no A1
  if (legacyUnit && cefr === 'A1') {
    const at = built.findIndex((u) => u.id.endsWith('-apresentacoes')) + 1;
    const pos = built[at] && built[at].id.endsWith('-particulas') ? at + 1 : at;
    built.splice(pos, 0, legacyUnit);
  }
  built.forEach((u, i) => { u.order = i + 1; });

  return { id: levelId, cefr, title: LEVEL_INFO[cefr].title, units: built };
}
