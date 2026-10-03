/**
 * ContentRepository: de onde vêm idiomas, níveis, unidades, aulas e exercícios.
 *
 * Hoje: conteúdo empacotado no app (src/content/courses).
 * Depois: as mesmas consultas lendo do Supabase (tabelas languages → exercise_options).
 * As telas só usam as funções exportadas aqui, então a troca não afeta a interface.
 */
import { en, es, it, fr, de, pt } from './courses/latin.js';
import { ja, ko, zh } from './courses/asian.js';

const COURSES = { en, es, it, fr, de, ja, ko, zh, pt };

export const getCourse = (code) => COURSES[code] || null;
export const allCourses = () => Object.values(COURSES);
