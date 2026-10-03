import { h } from '../../core/dom.js';
import { TextField, Button, Checkbox, Notice, setLoading } from '../../components/ui.js';
import { AuthService, validators } from '../../services/auth/AuthService.js';

export function LoginPage({ onAuthenticated }) {
  const email = TextField({ id: 'login-email', label: 'E-mail', type: 'email', autocomplete: 'email', inputmode: 'email' });
  const password = TextField({ id: 'login-password', label: 'Senha', type: 'password', autocomplete: 'current-password' });
  const remember = Checkbox({ id: 'login-remember', label: 'Manter conectado' });
  const notice = Notice({ tone: 'error' });
  const submit = Button({ label: 'Entrar', type: 'submit', block: true, size: 'lg' });

  const form = h(
    'form',
    { class: 'form', novalidate: true },
    h('h1', { class: 'auth__title' }, 'Entre na sua conta'),
    notice,
    email,
    password,
    h('div', { class: 'form__row' }, remember, h('a', { class: 'link', href: '#recuperar' }, 'Esqueci minha senha')),
    submit,
    h('div', { class: 'auth__switch' },
      h('p', { class: 'auth__switch-text' }, 'Não tenho uma conta'),
      Button({ label: 'Criar conta', variant: 'secondary', href: '#cadastro', block: true, size: 'lg' }),
    ),
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    notice.show('');
    const errs = {
      email: validators.email(email.value()),
      password: password.value() ? '' : 'Digite sua senha.',
    };
    email.setError(errs.email);
    password.setError(errs.password);
    if (errs.email) return email.input.focus();
    if (errs.password) return password.input.focus();

    const restore = setLoading(submit, 'Entrando…');
    try {
      const user = await AuthService.signIn(
        { email: email.value(), password: password.value() },
        { remember: remember.input.checked },
      );
      onAuthenticated(user);
    } catch (err) {
      restore();
      notice.show(err.message || 'Não foi possível entrar agora.', 'error');
      if (err.field === 'email') email.input.focus();
    }
  });

  return form;
}
