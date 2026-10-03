/**
 * Perfil: conta, plano, personalidade do Zuno e preferências.
 * Só uma personalidade fica ativa por vez. Ofensivo exige Plus e confirmação.
 */
import { h } from '../../core/dom.js';
import { PLANS } from '../../config/app.config.js';
import { AuthService } from '../../services/auth/AuthService.js';
import { SettingsService } from '../../services/settings/SettingsService.js';
import { AudioService } from '../../services/audio/AudioService.js';
import { PageHeader, Button } from '../../components/ui.js';
import { icon } from '../../components/icons.js';
import { PERSONALITIES } from '../../zuno/reactions.js';
import { ZunoCharacter } from '../../zuno/ZunoCharacter.js';
import { ProgressService, formatDuration } from '../../services/progress/ProgressService.js';
import { VoiceService } from '../../services/voice/VoiceService.js';
import { MyLanguages } from '../../components/LanguageList.js';
import { Stat } from '../../components/ui.js';
import { EVOLUTION_ITEMS, stageFor } from '../../zuno/evolution.js';
import { myEvolution } from '../../zuno/myZuno.js';
import { PLUS_PRICE } from '../../config/plans.js';

const PERSONALITY_STATE = { light: 'happy', provocador: 'provocative', ofensivo: 'mischievous' };

export function ProfilePage({ user, signOut, rerender }) {
  const since = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '—';
  const settings = SettingsService.get(user.id);
  const active = SettingsService.personalityFor(user);

  const row = (label, value) => h('div', { class: 'info-row' }, h('dt', {}, label), h('dd', {}, value));

  const progress = ProgressService.load(user.id);
  const totals = ProgressService.totals(progress);
  const stage = stageFor(totals.xp);
  const codes = ProgressService.languagesByRecent(progress).map((l) => l.code);
  const time = formatDuration(totals.seconds);
  // O Zuno do perfil reflete o progresso: curioso no começo, feliz quando avança, orgulhoso lá na frente.
  const heroState = totals.xp >= 300 ? 'proud' : totals.xp >= 100 ? 'happy' : totals.lessonsCompleted > 0 ? 'happy' : 'neutral';

  return h('div', { class: 'page profile-page' },
    h('section', { class: 'profile-hero' },
      h('div', { class: 'profile-hero__zuno' }, ZunoCharacter({ size: 'lg', state: heroState, decorative: true, evolution: myEvolution(user) })),
      h('div', { class: 'profile-hero__text' },
        h('p', { class: 'eyebrow' }, stage.label),
        h('h1', { class: 'page-title' }, user.name),
        h('p', { class: 'profile__email' }, user.email),
        h('div', { class: 'profile-hero__chips' },
          h('span', { class: `plan-chip plan-chip--${user.plan}` }, (PLANS[user.plan] || PLANS.free).label),
          h('span', { class: 'persona-chip' }, `Personalidade: ${(PERSONALITIES[active] || PERSONALITIES.light).label}`),
        ),
        stage.next && h('p', { class: 'muted' }, `Faltam ${stage.toNext} XP para ${stage.next.label}.`),
      ),
    ),
    h('div', { class: 'stats stats--grid' },
      Stat({ iconName: 'bolt', value: totals.xp, unit: 'XP', label: 'Experiência' }),
      Stat({ iconName: 'flame', value: totals.streak, unit: totals.streak === 1 ? 'dia' : 'dias', label: 'Sequência' }),
      Stat({ iconName: 'words', value: totals.words, label: 'Palavras aprendidas' }),
      Stat({ iconName: 'lessons', value: totals.lessonsCompleted, label: 'Aulas concluídas' }),
      Stat({ iconName: 'clock', value: time.value, unit: time.unit, label: 'Tempo estudado' }),
    ),
    h('section', { class: 'settings-block', 'aria-labelledby': 'my-langs' },
      h('h2', { class: 'section-title', id: 'my-langs' }, 'Idiomas e níveis'),
      codes.length ? MyLanguages({ progress, codes }) : h('p', { class: 'muted' }, 'Nenhum idioma ainda.'),
    ),
    PersonalityPicker({ user, active, onChange: rerender }),
    EvolutionGallery({ user, progress, onChange: rerender }),
    Preferences({ user, settings, onChange: rerender }),
    h('section', { class: 'profile' },
      h('dl', { class: 'info-list' },
        row('Plano', user.plan === 'plus' ? 'Zuno Plus' : `Free · Plus por ${PLUS_PRICE.label}`),
        row('Tipo de conta', AuthService.capabilities.label),
        row('No Zuno desde', since),
      ),
    ),
    h('div', { class: 'profile__actions' },
      user.plan !== 'plus' && Button({ label: 'Conhecer o Plus', href: '#plus' }),
      Button({ label: 'Sair da conta', variant: 'secondary', icon: 'logout', onClick: signOut }),
    ),
  );
}

/** Evolução do Zuno: o que já foi conquistado e o que falta. */
function EvolutionGallery({ user, progress, onChange }) {
  const unlocked = new Set(progress.evolution?.unlocked || []);
  const equipped = new Set(progress.evolution?.equipped || []);
  return h('section', { class: 'settings-block', 'aria-labelledby': 'evo-title' },
    h('div', {},
      h('h2', { class: 'section-title', id: 'evo-title' }, 'Evolução do Zuno'),
      h('p', { class: 'muted' }, 'Ele ganha poses, animações e acessórios conforme você avança. O Zuno continua sendo o Zuno.'),
    ),
    h('ul', { class: 'evo', role: 'list' }, EVOLUTION_ITEMS.map((item) => {
      const has = unlocked.has(item.id);
      const locked = item.plus && user.plan !== 'plus';
      return h('li', { class: `evo__item${has ? ' is-on' : ''}` },
        h('span', { class: 'evo__type' }, item.type),
        h('strong', { class: 'evo__label' }, item.label),
        h('span', { class: 'evo__req' }, has ? 'Conquistado' : item.description),
        locked && !has && h('span', { class: 'plus-chip plus-chip--sm' }, icon('lock'), 'Plus'),
        has && h('button', { class: `evo__equip${equipped.has(item.id) ? ' is-active' : ''}`, type: 'button', 'aria-pressed': String(equipped.has(item.id)),
          onClick: () => { ProgressService.toggleEquip(user.id, item.id); onChange(); } }, equipped.has(item.id) ? 'Usando' : 'Usar'),
      );
    })),
  );
}

function PersonalityPicker({ user, active, onChange }) {
  const preview = ZunoCharacter({ size: 'md', state: PERSONALITY_STATE[active], decorative: true });
  const consentBox = h('div', { class: 'consent' });
  consentBox.hidden = true;

  const choose = (id) => {
    const p = PERSONALITIES[id];
    if (!SettingsService.canUsePersonality(user, id)) {
      location.hash = 'plus';
      return;
    }
    if (p.requiresConsent && active !== id) {
      showConsent(id);
      return;
    }
    SettingsService.setPersonality(user, id);
    onChange();
  };

  function showConsent(id) {
    const check = h('input', { type: 'checkbox', id: 'consent-ofensivo', class: 'check__input' });
    const confirm = Button({ label: 'Ativar Ofensivo', size: 'lg' });
    confirm.disabled = true;
    check.addEventListener('change', () => { confirm.disabled = !check.checked; });
    confirm.addEventListener('click', () => { SettingsService.setPersonality(user, id); onChange(); });
    consentBox.replaceChildren(
      h('p', { class: 'consent__title' }, 'Antes de ativar'),
      h('p', { class: 'consent__text' }, 'No modo Ofensivo, o Zuno xinga você de brincadeira (burro, besta, jumento) quando você erra. É humor exagerado sobre as respostas. Você pode voltar para Light quando quiser.'),
      h('label', { class: 'check', for: 'consent-ofensivo' }, check, h('span', { class: 'check__box', 'aria-hidden': 'true' }, icon('check')), h('span', {}, 'Entendi e quero ativar')),
      h('div', { class: 'consent__actions' }, confirm, Button({ label: 'Cancelar', variant: 'secondary', size: 'lg', onClick: () => { consentBox.hidden = true; } })),
    );
    consentBox.hidden = false;
    check.focus();
  }

  const cards = Object.values(PERSONALITIES).map((p) => {
    const locked = !SettingsService.canUsePersonality(user, p.id);
    const isActive = active === p.id;
    return h('button', {
      class: `persona${isActive ? ' is-active' : ''}${locked ? ' is-locked' : ''}`,
      type: 'button',
      role: 'radio',
      'aria-checked': String(isActive),
      onClick: () => choose(p.id),
    },
      h('span', { class: 'persona__top' },
        h('span', { class: 'persona__name' }, p.label),
        locked ? h('span', { class: 'plus-chip plus-chip--sm' }, icon('lock'), 'Plus')
          : isActive ? h('span', { class: 'persona__on' }, icon('check'), 'Ativa') : null,
      ),
      h('span', { class: 'persona__desc' }, p.description),
    );
  });

  return h('section', { class: 'settings-block', 'aria-labelledby': 'persona-title' },
    h('div', { class: 'settings-block__head' },
      h('div', {},
        h('h2', { class: 'section-title', id: 'persona-title' }, 'Personalidade do Zuno'),
        h('p', { class: 'muted' }, 'Só uma fica ativa. Vale para todas as aulas.'),
      ),
      h('div', { class: 'settings-block__zuno' }, preview),
    ),
    h('div', { class: 'personas', role: 'radiogroup', 'aria-labelledby': 'persona-title' }, cards),
    consentBox,
  );
}

function Preferences({ user, settings, onChange }) {
  const toggle = (id, label, hint, value, onToggle, disabled = false) => {
    const input = h('input', { type: 'checkbox', id, class: 'switch__input', checked: value, disabled });
    input.addEventListener('change', () => { onToggle(input.checked); onChange(); });
    return h('label', { class: `switch${disabled ? ' is-disabled' : ''}`, for: id },
      h('span', { class: 'switch__text' }, h('span', { class: 'switch__label' }, label), hint && h('span', { class: 'switch__hint' }, hint)),
      input,
      h('span', { class: 'switch__track', 'aria-hidden': 'true' }, h('span', { class: 'switch__thumb' })),
    );
  };

  const soundReady = AudioService.hasAnySound();
  const voiceInfo = h('span', {}, 'Verificando…');
  VoiceService.status('en').then((v) => {
    voiceInfo.textContent = v.cloud ? 'Voz própria do Zuno ativa.' : v.device ? 'Usando a voz do seu aparelho. A voz própria do Zuno (servidor de voz) ainda não está configurada.' : 'Seu aparelho não tem voz disponível e a voz própria do Zuno ainda não está configurada.';
  });
  return h('section', { class: 'settings-block', 'aria-labelledby': 'prefs-title' },
    h('h2', { class: 'section-title', id: 'prefs-title' }, 'Preferências'),
    h('div', { class: 'switches' },
      toggle('pref-voice', 'O Zuno fala em voz alta', voiceInfo, settings.voice !== false,
        (v) => SettingsService.update(user.id, { voice: v })),
      toggle('pref-motion', 'Reduzir animações', 'O Zuno continua aparecendo, mas sem flutuar nem pular.', settings.reduceMotion,
        (v) => SettingsService.update(user.id, { reduceMotion: v })),
      toggle('pref-translation', 'Mostrar tradução das falas do Zuno', 'No Modo Difícil, a tradução fica escondida até você pedir.', settings.showTranslation,
        (v) => SettingsService.update(user.id, { showTranslation: v })),
      toggle('pref-sound', 'Sons e risadas do Zuno', soundReady ? null : 'Os áudios do Zuno ainda não foram adicionados.', soundReady && settings.sound,
        (v) => SettingsService.update(user.id, { sound: v }), !soundReady),
    ),
  );
}
