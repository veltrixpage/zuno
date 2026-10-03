/**
 * Componentes de interface reutilizáveis.
 * Todos recebem props simples e devolvem um nó DOM.
 */
import { h, uniqueId } from '../core/dom.js';
import { icon } from './icons.js';

/* ---------- Marca ---------- */
export const Wordmark = ({ size = 'md' } = {}) =>
  h('span', { class: `wordmark wordmark--${size}` }, 'ZUNO');

/* ---------- Botões ---------- */
export function Button({ label, variant = 'primary', type = 'button', icon: iconName, iconAfter, block, onClick, href, size } = {}) {
  const cls = ['btn', `btn--${variant}`, block && 'btn--block', size && `btn--${size}`].filter(Boolean).join(' ');
  const content = [
    iconName && icon(iconName),
    h('span', { class: 'btn__label' }, label),
    iconAfter && icon(iconAfter),
  ];
  if (href) return h('a', { class: cls, href }, content);
  return h('button', { class: cls, type, onClick }, content);
}

/** Coloca o botão em estado de carregamento e devolve a função para restaurar. */
export function setLoading(btn, loadingLabel) {
  const label = btn.querySelector('.btn__label');
  const original = label.textContent;
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  label.textContent = loadingLabel;
  return () => {
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    label.textContent = original;
  };
}

/* ---------- Campo de texto ---------- */
export function TextField({ id, label, type = 'text', autocomplete, required = true, inputmode } = {}) {
  const fieldId = id || uniqueId('f');
  const errorId = `${fieldId}-error`;
  const input = h('input', {
    class: 'field__input',
    id: fieldId,
    name: fieldId,
    type,
    autocomplete,
    inputmode,
    required,
    spellcheck: 'false',
    autocapitalize: type === 'email' || type === 'password' ? 'none' : null,
    'aria-describedby': errorId,
  });

  const control = h('div', { class: 'field__control' }, input);

  if (type === 'password') {
    const toggle = h('button', { class: 'field__toggle', type: 'button', 'aria-label': 'Mostrar senha' }, icon('eye'));
    toggle.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      toggle.replaceChildren(icon(show ? 'eyeOff' : 'eye'));
      input.focus();
    });
    control.append(toggle);
    control.classList.add('field__control--action');
  }

  const error = h('p', { class: 'field__error', id: errorId, 'aria-live': 'polite' });
  const root = h('div', { class: 'field' }, h('label', { class: 'field__label', for: fieldId }, label), control, error);

  root.input = input;
  root.value = () => input.value;
  root.setError = (msg) => {
    error.textContent = msg || '';
    root.classList.toggle('field--invalid', Boolean(msg));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };
  input.addEventListener('input', () => root.classList.contains('field--invalid') && root.setError(''));
  return root;
}

/* ---------- Checkbox ---------- */
export function Checkbox({ id, label, checked = false } = {}) {
  const input = h('input', { type: 'checkbox', id, name: id, class: 'check__input', checked });
  const root = h('label', { class: 'check', for: id }, input, h('span', { class: 'check__box', 'aria-hidden': 'true' }, icon('check')), h('span', {}, label));
  root.input = input;
  return root;
}

/* ---------- Aviso em linha ---------- */
export function Notice({ tone = 'info' } = {}) {
  const el = h('div', { class: `notice notice--${tone}`, role: 'status' });
  el.hidden = true;
  el.show = (text, nextTone) => {
    if (nextTone) el.className = `notice notice--${nextTone}`;
    el.textContent = text;
    el.hidden = !text;
  };
  return el;
}

/* ---------- Progresso ---------- */
export function ProgressBar({ value = 0, label = 'Progresso' } = {}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return h(
    'div',
    { class: 'progress', role: 'progressbar', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(v) },
    h('div', { class: 'progress__fill', style: { width: `${v}%` } }),
  );
}

/* ---------- Métrica pequena ---------- */
export function Stat({ iconName, value, unit, label }) {
  return h(
    'div',
    { class: 'stat' },
    h('span', { class: 'stat__icon' }, icon(iconName)),
    h('span', { class: 'stat__text' },
      h('span', { class: 'stat__value' }, String(value), unit ? h('small', {}, ` ${unit}`) : null),
      h('span', { class: 'stat__label' }, label),
    ),
  );
}

/* ---------- Selo de idioma (código, sem bandeiras) ---------- */
export const LangBadge = ({ code, size = 'md' }) =>
  h('span', { class: `lang-badge lang-badge--${size}`, 'aria-hidden': 'true' }, code.toUpperCase());

/* ---------- Cabeçalho de página ---------- */
export function PageHeader({ eyebrow, title, subtitle }) {
  return h(
    'header',
    { class: 'page-header' },
    eyebrow && h('p', { class: 'eyebrow' }, eyebrow),
    h('h1', { class: 'page-title' }, title),
    subtitle && h('p', { class: 'page-subtitle' }, subtitle),
  );
}

/* ---------- Estado vazio / em preparação ---------- */
export function Placeholder({ title, text, iconName = 'lock' }) {
  return h(
    'section',
    { class: 'placeholder' },
    h('span', { class: 'placeholder__icon' }, icon(iconName)),
    h('h2', { class: 'placeholder__title' }, title),
    h('p', { class: 'placeholder__text' }, text),
  );
}
