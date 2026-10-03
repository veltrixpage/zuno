/**
 * Modo Mundo e Conversar com Zuno: situações, temas e objetivos.
 *
 * Conteúdo de ROTEIRO (escrito à mão): nome, emoji, cena de abertura e os
 * conceitos de vocabulário que a IA deve fazer aparecer NATURALMENTE durante
 * a conversa. As falas da situação em si são geradas pela IA real.
 */

/** Cidade onde cada idioma "acontece" no Modo Mundo. */
export const WORLD_PLACES = {
  en: { country: 'Estados Unidos', city: 'Nova York' },
  es: { country: 'Espanha', city: 'Madri' },
  it: { country: 'Itália', city: 'Roma' },
  fr: { country: 'França', city: 'Paris' },
  de: { country: 'Alemanha', city: 'Berlim' },
  ja: { country: 'Japão', city: 'Tóquio' },
  ko: { country: 'Coreia do Sul', city: 'Seul' },
  zh: { country: 'China', city: 'Xangai' },
  pt: { country: 'Portugal', city: 'Lisboa' },
};

/** "Pronto?" do Zuno no idioma estudado (abre a situação). */
export const READY = {
  en: ['Hello! Ready?', 'Olá! Pronto?'],
  es: ['¡Hola! ¿Listo?', 'Olá! Pronto?'],
  it: ['Ciao! Pronto?', 'Olá! Pronto?'],
  fr: ['Bonjour ! Prêt ?', 'Olá! Pronto?'],
  de: ['Hallo! Bereit?', 'Olá! Pronto?'],
  ja: ['こんにちは！準備はいい？', 'Olá! Pronto?'],
  ko: ['안녕하세요! 준비됐어요?', 'Olá! Pronto?'],
  zh: ['你好！准备好了吗？', 'Olá! Pronto?'],
  pt: ['Olá! Pronto?', null],
};

/**
 * Situações do Modo Mundo.
 * free: disponível no plano Free (o resto é Plus).
 * role: quem a IA interpreta. vocab: conceitos que devem surgir na conversa.
 */
export const SITUATIONS = [
  { id: 'cafeteria', emoji: '☕', label: 'Cafeteria', free: true, scene: 'Você acabou de entrar em uma cafeteria em {city}.', role: 'barista', goal: 'pedir uma bebida e algo para comer, perguntar o preço e pagar', vocab: ['coffee', 'tea', 'milk', 'sugar', 'to go / for here', 'the bill', 'how much'] },
  { id: 'aeroporto', emoji: '✈️', label: 'Aeroporto', free: true, scene: 'Você está no balcão de check-in de um aeroporto em {city}.', role: 'atendente de check-in', goal: 'fazer o check-in, despachar a mala e descobrir o portão', vocab: ['boarding pass', 'gate', 'flight', 'passport', 'luggage', 'window/aisle seat', 'delay'] },
  { id: 'restaurante', emoji: '🍽️', label: 'Restaurante', free: true, scene: 'Você chegou para jantar em um restaurante em {city}.', role: 'garçom ou garçonete', goal: 'pedir uma mesa, escolher pratos, perguntar sobre ingredientes e pedir a conta', vocab: ['table for two', 'menu', 'starter', 'main course', 'allergy', 'the bill', 'tip'] },
  { id: 'hotel', emoji: '🏨', label: 'Hotel', scene: 'Você chegou à recepção de um hotel em {city}.', role: 'recepcionista', goal: 'fazer o check-in, perguntar sobre café da manhã e Wi-Fi', vocab: ['reservation', 'room key', 'breakfast', 'check-out', 'floor', 'wifi password'] },
  { id: 'trabalho', emoji: '💼', label: 'Trabalho', scene: 'É seu primeiro dia em um escritório em {city}.', role: 'colega de trabalho', goal: 'se apresentar, falar da sua função e combinar uma reunião', vocab: ['meeting', 'deadline', 'team', 'colleague', 'schedule', 'email'] },
  { id: 'games', emoji: '🎮', label: 'Games', scene: 'Você entrou numa partida online com jogadores de {city}.', role: 'colega de equipe no jogo', goal: 'combinar a estratégia, pedir ajuda e comemorar', vocab: ['team', 'level', 'cover me', 'respawn', 'good game', 'strategy'] },
  { id: 'filmes', emoji: '🎬', label: 'Filmes', scene: 'Você está na fila de um cinema em {city}.', role: 'amigo que vai ao cinema com você', goal: 'escolher o filme, comprar ingressos e comentar o que achou', vocab: ['ticket', 'showtime', 'subtitles', 'trailer', 'plot', 'popcorn'] },
  { id: 'compras', emoji: '🛍️', label: 'Compras', scene: 'Você entrou em uma loja de roupas em {city}.', role: 'vendedor ou vendedora', goal: 'procurar uma peça, perguntar o tamanho, provar e pagar', vocab: ['size', 'fitting room', 'price', 'discount', 'receipt', 'card or cash'] },
  { id: 'transporte', emoji: '🚕', label: 'Transporte', scene: 'Você acabou de entrar em um táxi em {city}.', role: 'motorista', goal: 'dizer o destino, perguntar quanto tempo leva e pagar', vocab: ['address', 'traffic', 'how long', 'stop here', 'change', 'receipt'] },
  { id: 'faculdade', emoji: '🏫', label: 'Faculdade', scene: 'É a primeira semana de aula numa faculdade em {city}.', role: 'colega de turma', goal: 'se apresentar, falar do curso e combinar de estudar juntos', vocab: ['class', 'professor', 'homework', 'library', 'exam', 'schedule'] },
  { id: 'cotidiano', emoji: '🏠', label: 'Vida cotidiana', scene: 'Você encontrou seu vizinho no corredor do prédio em {city}.', role: 'vizinho', goal: 'puxar conversa, falar do dia e combinar algo', vocab: ['neighbor', 'weekend', 'groceries', 'weather', 'plans', 'see you'] },
  { id: 'conversa', emoji: '❤️', label: 'Conversa', scene: 'Você está num café em {city} conhecendo alguém novo.', role: 'pessoa que você acabou de conhecer', goal: 'se apresentar, falar de hobbies e combinar de se ver de novo', vocab: ['hobbies', 'favorite', 'free time', 'music', 'travel', 'next time'] },
  { id: 'viagem', emoji: '🧳', label: 'Viagem', scene: 'Você acabou de chegar em {city} e está num posto de informações turísticas.', role: 'atendente de turismo', goal: 'pedir dicas, perguntar como chegar a um lugar e sobre horários', vocab: ['map', 'museum', 'directions', 'opening hours', 'ticket', 'nearby'] },
  { id: 'tecnologia', emoji: '💻', label: 'Tecnologia', scene: 'Seu celular parou de funcionar e você foi a uma assistência técnica em {city}.', role: 'técnico', goal: 'explicar o problema, perguntar o prazo e o preço', vocab: ['screen', 'battery', 'charger', 'repair', 'warranty', 'password'] },
];

export const getSituation = (id) => SITUATIONS.find((s) => s.id === id) || null;

/** Temas de "Conversar com Zuno". */
export const TOPICS = [
  { id: 'cotidiano', emoji: '🏠', label: 'Cotidiano' },
  { id: 'viagem', emoji: '🧳', label: 'Viagem' },
  { id: 'trabalho', emoji: '💼', label: 'Trabalho' },
  { id: 'filmes', emoji: '🎬', label: 'Filmes' },
  { id: 'games', emoji: '🎮', label: 'Games' },
  { id: 'comida', emoji: '🍜', label: 'Comida' },
  { id: 'musica', emoji: '🎵', label: 'Música' },
  { id: 'estudos', emoji: '📚', label: 'Estudos' },
  { id: 'amizades', emoji: '🤝', label: 'Amizades' },
  { id: 'tecnologia', emoji: '💻', label: 'Tecnologia' },
];

export const getTopic = (id) => TOPICS.find((t) => t.id === id) || null;

/** Objetivo do usuário (a IA adapta exemplos e vocabulário). */
export const GOALS = [
  { id: 'viagem', label: 'Viajar' },
  { id: 'trabalho', label: 'Trabalho' },
  { id: 'estudos', label: 'Estudos' },
  { id: 'diversao', label: 'Por diversão' },
];
