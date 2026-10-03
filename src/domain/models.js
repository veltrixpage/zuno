/**
 * Modelos de domínio (JSDoc). Servem de contrato para os próximos módulos.
 * Nada aqui é conteúdo; são só formas de dados.
 *
 * @typedef {'A1'|'A2'|'B1'|'B2'|'C1'|'C2'} CefrLevel   Escala do Quadro Europeu (QECR)
 *
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} languageCode
 * @property {string} title
 * @property {Level[]} levels
 *
 * @typedef {Object} Level
 * @property {string} id
 * @property {CefrLevel} cefr
 * @property {Lesson[]} lessons
 *
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {number} xp
 * @property {Exercise[]} exercises
 * @property {boolean} [plusOnly]   Conteúdo do plano Plus
 *
 * @typedef {'choice'|'translate'|'listen'|'speak'|'match'|'write'} ExerciseType
 *
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {ExerciseType} type
 * @property {string} prompt
 * @property {string[]} [options]
 * @property {string|string[]} answer
 * @property {import('../zuno/zuno.states.js').ZunoState} [zunoReaction]
 *
 * @typedef {Object} LanguageProgress
 * @property {string} code
 * @property {number} percent        0–100
 * @property {number} xp
 * @property {number} minutes        tempo de estudo
 * @property {string} startedAt      ISO
 * @property {string|null} lastStudiedAt
 *
 * @typedef {Object} UserProgress
 * @property {string|null} activeLanguage
 * @property {Record<string, LanguageProgress>} languages
 * @property {number} streak         dias seguidos
 * @property {string|null} lastStudyDay  AAAA-MM-DD
 */
/** Escala completa (QECR). C2 já existe na arquitetura, mas ainda não aparece no app. */
export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
/** Níveis do curso nesta versão (sem C1). */
export const ACTIVE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C2']; // C1 fica para uma próxima versão
