/**
 * Provedor "Claude na página": quando o Zuno é aberto como página publicada
 * no Claude, a página pode pedir respostas ao Claude da própria pessoa
 * (capacidade `sample`). É IA real. Não há chave no código: a pessoa autoriza
 * o uso na primeira mensagem e o custo sai da conta Claude dela.
 * Fora do Claude, `window.claude` não existe e este provedor fica indisponível.
 */
import { buildPrompt } from '../prompts.js';
import { AIError } from '../AIError.js';
import { CLAUDE_PAGE_TIERS } from '../../../config/ai.config.js';

let samplePromise = null;
function getSample() {
  if (!samplePromise) {
    samplePromise = (typeof window !== 'undefined' && window.claude?.use)
      ? window.claude.use('sample').catch(() => null)
      : Promise.resolve(null);
  }
  return samplePromise;
}

const CODE_MAP = {
  not_granted: 'not_granted', sampling_disabled: 'not_granted', not_declared: 'not_configured',
  capability_disabled: 'not_configured', capability_removed: 'not_configured',
  rate_limited: 'rate_limited', session_expired: 'auth', refused: 'refused',
  cancelled: 'cancelled', invalid_json: 'bad_output', empty_completion: 'bad_output',
};

export function createClaudePageProvider() {
  return {
    id: 'claude',
    label: 'Claude (nesta página)',
    available: async () => Boolean(await getSample()),
    async run(task, context, { signal } = {}) {
      const sample = await getSample();
      if (!sample) throw new AIError('not_configured');
      try {
        const result = await sample.json(buildPrompt(task, context), { cache: false, signal, modelTier: CLAUDE_PAGE_TIERS[task] || 'default' });
        return { result, usage: null };
      } catch (e) {
        throw new AIError(CODE_MAP[e?.code] || 'upstream', e?.message);
      }
    },
  };
}
