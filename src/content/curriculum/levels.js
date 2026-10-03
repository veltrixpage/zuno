/**
 * Os cinco níveis do Zuno nesta versão: A1, A2, B1, B2 e C2.
 * (C1 existe na escala QECR do modelo de dados, mas não é criado agora.)
 */
export const LEVEL_INFO = {
  A1: { title: 'Fundamentos', short: 'Iniciante', description: 'Cumprimentos, apresentações, números, cores, família, comida, rotina e perguntas simples.' },
  A2: { title: 'Construindo fluência', short: 'Iniciante', description: 'Passado, futuro, descrições, viagens, compras e trabalho.' },
  B1: { title: 'Comunicação intermediária', short: 'Intermediário', description: 'Opiniões, experiências, explicações, narrativas e situações profissionais.' },
  B2: { title: 'Conversação avançada', short: 'Intermediário', description: 'Argumentação, expressões naturais, verbos com nuance e negociação.' },
  C2: { title: 'Domínio avançado', short: 'Avançado', description: 'Registro, expressões idiomáticas, vocabulário sofisticado e nuances.' },
};

export const COURSE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C2'];

/** Ordem dos idiomas nas linhas do banco: pt, en, es, it, fr, de, ja, ko, zh */
export const BANK_ORDER = ['pt', 'en', 'es', 'it', 'fr', 'de', 'ja', 'ko', 'zh'];
