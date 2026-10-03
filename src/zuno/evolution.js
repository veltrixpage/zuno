/**
 * Evolução do Zuno: ele cresce junto com você.
 *
 * Nunca muda a identidade base do personagem. O que se desbloqueia são
 * poses, animações, acessórios que flutuam AO REDOR dele, pequenas variações
 * visuais e selos de idioma/progresso.
 *
 * Cada item: { id, type, label, description, plus?, test(stats) }
 * stats: { xp, streak, longest, lessons, words, languages, maxLevel, perfect, langXp }
 */
export const EVOLUTION_STAGES = [
  { min: 0, label: 'Zuno Curioso' },
  { min: 100, label: 'Zuno Explorador' },
  { min: 300, label: 'Zuno Viajante' },
  { min: 700, label: 'Zuno Poliglota' },
  { min: 1500, label: 'Zuno Mestre' },
];

const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4, C2: 5 };

export const EVOLUTION_ITEMS = [
  { id: 'pose-orgulhosa', type: 'pose', label: 'Pose orgulhosa', description: 'Conclua 3 aulas.', test: (s) => s.lessons >= 3 },
  { id: 'pose-surpresa', type: 'pose', label: 'Pose de surpresa', description: 'Aprenda 20 palavras.', test: (s) => s.words >= 20 },
  { id: 'giro', type: 'animação', label: 'Giro de comemoração', description: 'Junte 100 XP.', test: (s) => s.xp >= 100 },
  { id: 'brilho', type: 'animação', label: 'Rastro de brilho', description: 'Estude 3 dias seguidos.', test: (s) => s.longest >= 3 },
  { id: 'estrela', type: 'acessório', label: 'Estrela em órbita', description: 'Conclua 10 aulas.', test: (s) => s.lessons >= 10 },
  { id: 'bandeira', type: 'idioma', label: 'Bandeira do idioma', description: 'Junte 50 XP em um idioma.', test: (s) => s.langXp >= 50 },
  { id: 'livro', type: 'acessório', label: 'Livrinho voador', description: 'Aprenda 50 palavras.', test: (s) => s.words >= 50 },
  { id: 'aura', type: 'variação', label: 'Aura verde', description: 'Chegue ao nível A2.', test: (s) => s.maxLevel >= 2 },
  { id: 'poliglota', type: 'idioma', label: 'Selo poliglota', description: 'Estude 2 idiomas.', test: (s) => s.languages >= 2 },
  { id: 'chama', type: 'progresso', label: 'Chama da sequência', description: 'Estude 7 dias seguidos.', test: (s) => s.longest >= 7 },
  { id: 'perfeito', type: 'progresso', label: 'Medalha sem erros', description: 'Faça 5 aulas sem errar.', test: (s) => s.perfect >= 5 },
  { id: 'coroa', type: 'acessório', label: 'Coroa de domínio', description: 'Conclua uma aula do C2.', plus: true, test: (s) => s.maxLevel >= 5 },
  { id: 'aura-dourada', type: 'variação', label: 'Aura dourada', description: 'Junte 500 XP.', plus: true, test: (s) => s.xp >= 500 },
];

export const getItem = (id) => EVOLUTION_ITEMS.find((i) => i.id === id) || null;

export function stageFor(xp) {
  let stage = EVOLUTION_STAGES[0];
  let index = 0;
  EVOLUTION_STAGES.forEach((s, i) => { if (xp >= s.min) { stage = s; index = i; } });
  const next = EVOLUTION_STAGES[index + 1] || null;
  return { ...stage, index: index + 1, next, toNext: next ? next.min - xp : 0 };
}

/** Calcula os números que destravam itens a partir do progresso salvo. */
export function evolutionStats(p) {
  const lessons = Object.entries(p.lessons).filter(([, l]) => l.status === 'completed');
  const langXp = {};
  let maxLevel = 0;
  for (const [id, l] of lessons) {
    const [code, lvl] = id.split('-');
    langXp[code] = (langXp[code] || 0) + (l.xp || 0);
    maxLevel = Math.max(maxLevel, LEVEL_ORDER[lvl.toUpperCase()] || 0);
  }
  for (const lang of Object.values(p.languages)) maxLevel = Math.max(maxLevel, LEVEL_ORDER[lang.level] || 0);
  return {
    xp: p.stats.xp,
    streak: p.streak.current,
    longest: p.streak.longest,
    lessons: lessons.length,
    words: Object.values(p.stats.words).reduce((s, w) => s + w.length, 0),
    languages: Object.keys(p.languages).length,
    maxLevel,
    perfect: lessons.filter(([, l]) => l.wrong === 0).length,
    langXp: Math.max(0, ...Object.values(langXp)),
  };
}

/** Itens novos que o usuário acabou de conquistar (respeitando o plano). */
export function newlyUnlocked(p, plan) {
  const stats = evolutionStats(p);
  const have = new Set(p.evolution?.unlocked || []);
  return EVOLUTION_ITEMS.filter((i) => !have.has(i.id) && (!i.plus || plan === 'plus') && i.test(stats));
}
