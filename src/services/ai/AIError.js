/** Erros da IA, com mensagens prontas para a tela (português). */
export const AI_ERROR_COPY = {
  not_configured: 'A IA do Zuno ainda não está conectada neste app.',
  not_granted: 'Você não autorizou esta página a usar o Claude. Para conversar com o Zuno, autorize quando o pedido aparecer.',
  limit: 'Você usou todas as mensagens de IA do seu plano por hoje.',
  plus: 'Este recurso de IA é do Zuno Plus.',
  rate_limited: 'Muitas mensagens seguidas. Espere um pouco e tente de novo.',
  auth: 'Sua sessão expirou. Entre de novo.',
  network: 'Sem conexão com o servidor. Verifique sua internet.',
  refused: 'Não consegui responder a essa mensagem. Tente escrever de outro jeito.',
  bad_output: 'A resposta veio incompleta. Tente de novo.',
  upstream: 'A IA não respondeu agora. Tente de novo em instantes.',
  cancelled: '',
};

export class AIError extends Error {
  constructor(code, detail, usage) {
    super(AI_ERROR_COPY[code] || AI_ERROR_COPY.upstream);
    this.name = 'AIError';
    this.code = code;
    this.detail = detail || null;
    this.usage = usage || null;
  }
}
