import { h } from '../../core/dom.js';
import { TextField, Button, Notice, setLoading } from '../../components/ui.js';
import { AuthService, validators } from '../../services/auth/AuthService.js';
import { icon } from '../../components/icons.js';

export function ForgotPasswordPage() {
  const email = TextField({ id: 'forgot-email', label: 'E-mail da sua conta', type: 'email', autocomplete: 'email', inputmode: 'email' });
  const notice = Notice({ tone: 'info' });
  const submit = Button({ label: 'Enviar link de recuperação', type: 'submit', block: true, size: 'lg' });

  const form = h(
    'form',
    { class: 'form', novalidate: true },
    h('a', { class: 'back-link', href: '#login' }, icon('arrowLeft'), 'Voltar para entrar'),
    h('div', { class: 'auth__heading' },
      h('h1', { class: 'auth__title' }, 'Esqueci minha senha'),
      h('p', { class: 'auth__lead' }, 'Informe seu e-mail para criar uma nova senha.'),
    ),
    notice,
    email,
    submit,
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = validators.email(email.value());
    email.setError(err);
    if (err) return email.input.focus();
    const restore = setLoading(submit, 'Enviando…');
    try {
      const res = await AuthService.requestPasswordReset(email.value());
      notice.show(res.message, res.sent ? 'success' : 'info');
    } catch (e2) {
      notice.show(e2.message, 'error');
    } finally {
      restore();
    }
  });

  return form;
}
