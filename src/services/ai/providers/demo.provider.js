/**
 * ⚠️ CONTEÚDO DE DEMONSTRAÇÃO — SÓ PARA TESTES AUTOMATIZADOS.
 *
 * Ativo apenas quando `globalThis.__ZUNO_TEST__ === true` (o robô de testes
 * liga isso). Nunca aparece para usuários. As respostas abaixo são fixas,
 * NÃO são inteligência artificial, e a interface mostra o selo
 * "Demonstração" sempre que elas são usadas.
 */
export function createDemoProvider() {
  let turn = 0;
  return {
    id: 'demo',
    label: 'Demonstração (teste)',
    async run(task, context) {
      await new Promise((r) => setTimeout(r, 250));
      turn += 1;
      if (task === 'correct') {
        return { result: {
          demo: true, is_correct: false, you_wrote: context.text, natural: 'I have a dog.', native: "I've got a dog.",
          translation: 'Eu tenho um cachorro.', why: 'Com "I", usamos "have", não "has".',
          notes: [{ from: 'has', to: 'have', why: '"has" é só para he/she/it.' }],
          reaction: { text: 'HAHAHA. Classic mistake.', translation: 'HAHAHA. Erro clássico.' }, emotion: 'mischievous', laugh: 'mischievous',
        } };
      }
      if (task === 'explain') {
        return { result: { demo: true, term: context.text, translation: 'demonstração', literal: null, reading: null, note: 'Resposta de demonstração.', example: '—', example_translation: '—' } };
      }
      const user = context.userMessage || '';
      const wrong = /\b(has|is)\b/i.test(user) && /\bI\b/.test(user);
      return { result: {
        demo: true,
        reaction: wrong ? { text: 'Again? OMG. 😂', translation: 'De novo? Mds. 😂' } : null,
        correction: wrong ? { severity: 'major', you_wrote: user, natural: user.replace(/\bhas\b/i, 'have').replace(/\bI is\b/i, 'I am'), why: 'Com "I", usamos "have"/"am".', native: null } : null,
        reply: turn === 1
          ? { text: 'Hi! What would you like to drink today?', translation: 'Oi! O que você gostaria de beber hoje?' }
          : { text: wrong ? 'Try again: what do you have?' : 'Great! Anything else?', translation: wrong ? 'Tenta de novo: o que você tem?' : 'Ótimo! Mais alguma coisa?' },
        teach: turn === 1 ? { term: 'to go', translation: 'para viagem', reading: null, example: 'A coffee to go, please.', example_translation: 'Um café para viagem, por favor.', note: null } : null,
        emotion: wrong ? 'confused' : turn === 3 ? 'surprised' : 'happy',
        laugh: wrong ? 'mischievous' : null,
        surprise: turn === 3,
        difficulty: 'same',
        new_words: turn === 1 ? ['to go'] : [],
        summary: 'Demonstração: pedido numa cafeteria.',
        goal_done: false,
      } };
    },
  };
}
