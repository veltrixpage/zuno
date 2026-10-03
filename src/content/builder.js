/**
 * Monta um curso no mesmo formato das tabelas do banco
 * (levels → units → lessons → exercises → exercise_options).
 *
 * O conteúdo escrito à mão fica curto e legível; os IDs, a ordem e o plano
 * (free/plus) são gerados aqui, de forma estável. O mesmo formato é usado
 * pelo script que gera o seed SQL do Supabase (scripts/generate-seed.mjs).
 */

/**
 * Dois jeitos de escrever um exercício:
 *
 * 1) Compacto (múltipla escolha):  [kind, prompt, options[], explanation?, reading?]
 *    kind: 'complete' | 'meaning' | 'translate' · options[0] é a certa (a tela embaralha)
 *
 * 2) Objeto, para os outros tipos:
 *    { type: 'truefalse', statement, truth, explanation? }
 *    { type: 'order', translation, tokens[], distractors?[], join? }
 *    { type: 'match', pairs: [[idioma, português], ...] }
 *    { type: 'listen', say, options[], translation? }
 *    { type: 'reading', passage, question, options[] }
 *    { type: 'phrase', question, options[] }
 *    { type: 'write', prompt('___'), accept[], translation?, explanation? }
 *    { type: 'translate', prompt(pt), accept[] }
 *    { type: 'open', prompt, sample, keywords?[[...], ...] }
 *    { type: 'wordpick', sentence, target, question }
 */
export const INSTRUCTIONS = {
  complete: 'Complete a frase',
  meaning: 'O que significa?',
  translate: 'Como se diz?',
  truefalse: 'Verdadeiro ou falso?',
  order: 'Monte a frase',
  match: 'Associe as palavras',
  listen: 'Escute e responda',
  reading: 'Leia e responda',
  phrase: 'Identifique a frase',
  write: 'Escreva a palavra que falta',
  typed: 'Traduza',
  open: 'Resposta aberta',
  wordpick: 'Identifique a palavra',
};

import { buildLevel } from './curriculum/generator.js';
import { COURSE_LEVELS, LEVEL_INFO } from './curriculum/levels.js';
import { FREE_POLICY } from '../config/plans.js';

/**
 * Monta o curso completo de um idioma:
 *  - os 5 níveis (A1, A2, B1, B2, C2) gerados do banco do currículo;
 *  - a unidade escrita à mão nos Prompts 2–3 ("Frases essenciais"), preservada no A1
 *    com os mesmos IDs de antes (o progresso antigo continua valendo).
 * Depois aplica a política Free × Plus (config/plans.js).
 */
export function defineCourse(code, { a1Lessons, extras = {}, translations = {} }) {
  const legacyUnit = buildLegacyUnit(code, a1Lessons, extras, translations);
  const levels = COURSE_LEVELS.map((cefr, li) => {
    const lv = buildLevel(code, cefr, { legacyUnit });
    lv.units.forEach((u) => {
      u.lessons.forEach((l) => {
        l.xp = l.xp || (l.review ? 15 : 10);
        l.exercises = l.exercises.map((ex, ei) => (ex.id ? ex : toExercise(`${l.id}-e${ei + 1}`, ei + 1, ex, translations)));
      });
    });
    return { ...lv, order: li + 1, active: true, info: LEVEL_INFO[cefr] };
  });
  applyFreePolicy(levels);
  return { language: code, levels };
}

/** Unidade original (Prompts 2–3), com IDs estáveis: <idioma>-a1-u1-l1… */
function buildLegacyUnit(code, a1Lessons, extras, translations) {
  const unitId = `${code}-a1-u1`;
  const lessons = a1Lessons.map((authored, li) => {
    const id = `${unitId}-l${li + 1}`;
    const raw = [...authored.exercises, ...(extras[li + 1] || [])];
    return {
      id, order: li + 1, title: authored.title, xp: 10, words: authored.words || [],
      exercises: raw.map((ex, ei) => toExercise(`${id}-e${ei + 1}`, ei + 1, ex, translations)),
    };
  });
  return { id: unitId, order: 0, title: 'Frases essenciais', skills: ['gramática', 'vocabulário', 'reading', 'writing'], grammar: null, lessons };
}

function applyFreePolicy(levels) {
  for (const level of levels) {
    const rule = FREE_POLICY[level.cefr] || { lessons: 0 };
    let count = 0;
    level.units.forEach((unit, ui) => {
      unit.lessons.forEach((lesson) => {
        const free = rule.units ? ui < rule.units : count < (rule.lessons || 0);
        lesson.tier = free ? 'free' : 'plus';
        count += 1;
      });
    });
  }
}

const opts = (id, labels) => labels.map((label, i) => ({ id: `${id}-o${i + 1}`, label, correct: i === 0 }));

function toExercise(id, order, ex, translations) {
  if (Array.isArray(ex)) {
    const [kind, prompt, options, explanation, reading] = ex;
    return {
      id, order, type: 'choice', kind,
      instruction: INSTRUCTIONS[kind] || INSTRUCTIONS.complete,
      prompt,
      reading: reading || null,
      explanation: explanation || null,
      translation: translations[prompt] || null,
      answer: options[0],
      options: opts(id, options),
    };
  }

  const base = { id, order, kind: ex.type || ex.kind, explanation: ex.explanation || null, reading: ex.reading || null, translation: ex.translation || null };
  if (!ex.type) {
    // Múltipla escolha gerada pelo currículo: options[0] é a certa
    return {
      ...base, type: 'choice', kind: ex.kind, instruction: ex.instruction || INSTRUCTIONS[ex.kind] || 'Escolha',
      prompt: ex.prompt || ex.question, say: ex.say || null, passage: ex.passage || null,
      answer: ex.options[0], options: opts(id, ex.options),
    };
  }
  switch (ex.type) {
    case 'teach':
      return { ...base, type: 'teach', kind: ex.kind, title: ex.title || null, text: ex.text || null, skills: ex.skills || null, target: ex.target || null, answer: ex.target || '' };
    case 'speak':
      return { ...base, type: 'speak', instruction: 'Agora você', prompt: 'Ouça e repita em voz alta', say: ex.say, answer: ex.say };
    case 'truefalse': {
      const labels = ex.truth ? ['Verdadeiro', 'Falso'] : ['Falso', 'Verdadeiro'];
      return { ...base, type: 'choice', instruction: INSTRUCTIONS.truefalse, prompt: ex.statement, statement: true, answer: labels[0], options: opts(id, labels) };
    }
    case 'listen':
      return { ...base, type: 'choice', instruction: INSTRUCTIONS.listen, prompt: 'O que você ouviu?', say: ex.say, answer: ex.options[0], options: opts(id, ex.options) };
    case 'reading':
      return { ...base, type: 'choice', instruction: INSTRUCTIONS.reading, passage: ex.passage, prompt: ex.question, answer: ex.options[0], options: opts(id, ex.options) };
    case 'phrase':
      return { ...base, type: 'choice', instruction: INSTRUCTIONS.phrase, prompt: ex.question, answer: ex.options[0], options: opts(id, ex.options) };
    case 'order':
      return { ...base, type: 'order', instruction: INSTRUCTIONS.order, prompt: ex.translation, tokens: ex.tokens, distractors: ex.distractors || [], join: ex.join ?? ' ', answer: ex.tokens.join(ex.join ?? ' ') };
    case 'match':
      return { ...base, type: 'match', instruction: INSTRUCTIONS.match, prompt: 'Toque em um par de cada vez.', pairs: ex.pairs, answer: ex.pairs.map(([a, b]) => `${a} = ${b}`).join(' · ') };
    case 'write':
      return { ...base, type: 'write', instruction: INSTRUCTIONS.write, prompt: ex.prompt, accept: ex.accept, answer: ex.accept[0], translation: ex.translation || translations[ex.prompt] || null };
    case 'translate':
      return { ...base, type: 'write', kind: 'typed', instruction: INSTRUCTIONS.typed, prompt: ex.prompt, accept: ex.accept, answer: ex.accept[0], typedTranslation: true };
    case 'open':
      return { ...base, type: 'open', instruction: INSTRUCTIONS.open, prompt: ex.prompt, sample: ex.sample, keywords: ex.keywords || [], answer: ex.sample };
    case 'wordpick':
      return { ...base, type: 'wordpick', instruction: INSTRUCTIONS.wordpick, prompt: ex.question, sentence: ex.sentence, target: ex.target, answer: ex.target };
    default:
      throw new Error(`Tipo de exercício desconhecido: ${ex.type}`);
  }
}

/** Atalho para escrever uma aula. */
export const lesson = (title, words, exercises) => ({ title, words, exercises });
