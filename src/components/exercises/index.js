/**
 * Registro dos tipos de atividade.
 * Contrato de todos os componentes:
 *
 *   Component({ exercise, lang, onAnswer }) -> Node
 *     onAnswer({ correct, given, expected })   // chamado uma única vez
 *
 * Tipo (exercise.type) → componente
 *   choice    múltipla escolha · complete a frase · verdadeiro ou falso ·
 *             escutar e responder · leitura · identificação de frase
 *   order     ordenar palavras
 *   match     associação de palavras
 *   write     escrita · tradução digitada
 *   open      resposta aberta
 *   wordpick  identificação de palavra
 *   teach     ENSINO: o Zuno apresenta (não vale ponto)
 *   speak     FALA: ouvir, repetir e gravar (não vale ponto)
 * "Revisão" não é um tipo: é uma sessão montada com os erros guardados
 * (pages/app/LessonPage.js, modo 'review').
 *
 * Próximos (precisam de integração): 'speak' (reconhecimento de fala).
 */
import { ChoiceExercise } from './ChoiceExercise.js';
import { OrderExercise } from './OrderExercise.js';
import { MatchExercise } from './MatchExercise.js';
import { WriteExercise } from './WriteExercise.js';
import { OpenExercise } from './OpenExercise.js';
import { WordPickExercise } from './WordPickExercise.js';
import { TeachExercise } from './TeachExercise.js';
import { SpeakExercise } from './SpeakExercise.js';

export const EXERCISE_TYPES = {
  choice: ChoiceExercise,
  order: OrderExercise,
  match: MatchExercise,
  write: WriteExercise,
  open: OpenExercise,
  wordpick: WordPickExercise,
  teach: TeachExercise,
  speak: SpeakExercise,
};

export function renderExercise(props) {
  const Component = EXERCISE_TYPES[props.exercise.type] || ChoiceExercise;
  const node = Component(props);
  // Só nos testes automatizados: expõe a solução para o robô responder.
  if (globalThis.__ZUNO_TEST__) {
    const e = props.exercise;
    node.dataset.solution = JSON.stringify({ type: e.type, answer: e.answer, tokens: e.tokens, join: e.join, pairs: e.pairs, accept: e.accept, target: e.target, sample: e.sample });
  }
  return node;
}
