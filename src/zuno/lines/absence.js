/**
 * Falas do Zuno quando você volta depois de dias sem estudar (Início).
 * Faixas: 3+ dias, 7+ dias, 14+ dias. Variações por personalidade, sem repetir sempre.
 */
export const ABSENCE_LINES = {
  light: {
    short: ['Você sumiu. Senti sua falta.', 'Você voltou! Bora continuar?', 'Que bom te ver de novo.'],
    week: ['Olha quem resolveu aparecer!', 'Finalmente. Eu estava dormindo sem você.', 'Uma semana! Vamos com calma.'],
    long: ['Eu já estava criando raízes.', 'Você voltou. Eu cochilei um pouquinho… muito.', 'Que saudade! Vamos revisar o básico juntos.'],
  },
  provocador: {
    short: ['Você sumiu. Achei que tinha desistido.', 'Ah, lembrou de mim?', 'Três dias… tava ocupado ou fugindo?'],
    week: ['Olha quem resolveu aparecer.', 'Finalmente. Eu estava dormindo sem você.', 'Uma semana inteira. Impressionante. Negativamente.'],
    long: ['Eu já estava criando raízes.', 'Você voltou! Eu já tinha virado planta.', 'Achei que era fantasma. É você mesmo?'],
  },
  ofensivo: {
    short: ['Você sumiu, jumento. Onde estava?', 'Voltou, seu besta? Que milagre.', 'Três dias sem estudar. Que animal.'],
    week: ['Olha quem resolveu aparecer. O desaparecido.', 'Finalmente, seu besta. Eu estava dormindo sem você.', 'Uma semana. Parabéns, você esqueceu tudo.'],
    long: ['Eu já estava criando raízes, seu animal.', 'Você voltou! Eu já tinha virado árvore e dado fruto.', 'Achei que tinha morrido. Infelizmente não. Bora estudar.'],
  },
};

export function absenceBucket(days) {
  if (days == null || days < 3) return null;
  if (days < 7) return 'short';
  if (days < 14) return 'week';
  return 'long';
}

export function absenceLine(personality, days) {
  const bucket = absenceBucket(days);
  if (!bucket) return null;
  const list = (ABSENCE_LINES[personality] || ABSENCE_LINES.light)[bucket];
  return list[Math.floor(Math.random() * list.length)];
}
