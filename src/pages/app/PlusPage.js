/**
 * Zuno Plus · preço configurável em config/plans.js (R$ 19,90/mês).
 * O pagamento ainda não está integrado: o botão diz isso, sem fingir.
 */
import { h } from '../../core/dom.js';
import { Button } from '../../components/ui.js';
import { icon } from '../../components/icons.js';
import { ZunoCharacter } from '../../zuno/ZunoCharacter.js';
import { PLUS_PRICE } from '../../config/plans.js';

const BENEFITS = [
  ['Curso completo', 'A1, A2, B1, B2 e C2 inteiros, em todos os idiomas.'],
  ['Modo Difícil completo', 'Todas as aulas, sem moleza.'],
  ['Modo Mundo completo', 'As 14 situações reais, em todos os idiomas.'],
  ['Mais IA e mais conversa', 'Limites bem maiores para conversar, corrigir textos e praticar.'],
  ['Mais voz e pronúncia', 'Prática de pronúncia com todas as frases.'],
  ['Personalidade Ofensiva', 'Para quem aguenta ser chamado de jumento (com carinho).'],
  ['Evolução avançada do Zuno', 'Acessórios e variações exclusivos.'],
];

const FREE = ['Todos os idiomas para experimentar', 'O começo de cada nível (A1 com 4 unidades inteiras)', 'Parte do Modo Difícil e do Modo Mundo', 'Personalidades Light e Provocador', 'Algumas conversas com IA e voz por dia'];

export function PlusPage({ user }) {
  const back = () => (history.length > 1 ? history.back() : (location.hash = 'inicio'));
  const subscribe = Button({ label: user.plan === 'plus' ? 'Você já é Plus' : `Assinar por ${PLUS_PRICE.label}`, size: 'lg' });
  subscribe.disabled = true;

  return h('div', { class: 'page plus' },
    h('section', { class: 'plus__hero' },
      h('div', { class: 'plus__text' },
        h('p', { class: 'eyebrow' }, 'Zuno Plus'),
        h('h1', { class: 'page-title' }, 'Continue sua jornada com Zuno Plus.'),
        h('p', { class: 'plus__price' }, h('strong', {}, PLUS_PRICE.label.split('/')[0]), ` /${PLUS_PRICE.period}`),
        h('p', { class: 'page-subtitle' }, user.plan === 'plus' ? 'Seu plano já é Plus.' : 'Seu plano hoje: Free.'),
      ),
      h('div', { class: 'plus__zuno' }, ZunoCharacter({ size: 'lg', state: 'happy', decorative: true })),
    ),
    h('ul', { class: 'benefits', role: 'list' },
      BENEFITS.map(([title, text]) => h('li', { class: 'benefit' },
        h('span', { class: 'benefit__icon' }, icon('check')),
        h('span', {}, h('strong', {}, title), h('span', { class: 'benefit__text' }, text)),
      )),
    ),
    h('div', { class: 'plus__cta' },
      subscribe,
      h('p', { class: 'muted' }, 'O pagamento ainda não está integrado. Quando estiver, a assinatura acontece por aqui.'),
    ),
    h('section', { class: 'plus__free' },
      h('h2', { class: 'setup__title' }, 'No Free você continua com'),
      h('ul', { class: 'plus__free-list', role: 'list' }, FREE.map((f) => h('li', {}, f))),
    ),
    h('div', {}, Button({ label: 'Voltar', variant: 'secondary', icon: 'arrowLeft', onClick: back })),
  );
}
