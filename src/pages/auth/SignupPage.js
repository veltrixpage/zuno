import { h } from '../../core/dom.js';
import { TextField, Button, Notice, setLoading } from '../../components/ui.js';
import { AuthService, validators } from '../../services/auth/AuthService.js';

export function SignupPage({ onAuthenticated }) {
  const name = TextField({ id: 'signup-name', label: 'Nome', autocomplete: 'given-name' });
  const email = TextField({ id: 'signup-email', label: 'E-mail', type: 'email', autocomplete: 'email', inputmode: 'email' });
  const password = TextField({ id: 'signup-password', label: 'Senha', type: 'password', autocomplete: 'new-password' });
  const confirm = TextField({ id: 'signup-confirm', label: 'Confirmar senha', type: 'password', autocomplete: 'new-password' });
  const notice = Notice({ tone: 'error' });
  const submit = Button({ label: 'Criar minha conta', type: 'submit', block: true, size: 'lg' });

  const form = h(
    'form',
    { class: 'form', novalidate: true },
    h('div', { class: 'auth__heading' },
      h('h1', { class: 'auth__title' }, 'Criar conta'),
      h('p', { class: 'auth__lead' }, 'Leva menos de um minuto.'),
    ),
    notice,
    name,
    email,
    password,
    confirm,
    submit,
    h('p', { class: 'auth__footer' }, h('a', { class: 'link link--strong', href: '#login' }, 'Já tenho uma conta')),
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    notice.show('');
    const errs = [
      [name, validators.name(name.value())],
      [email, validators.email(email.value())],
      [password, validators.password(password.value())],
      [confirm, !confirm.value() ? 'Repita sua senha.' : confirm.value() !== password.value() ? 'As senhas não são iguais.' : ''],
    ];
    errs.forEach(([f, m]) => f.setError(m));
    const first = errs.find(([, m]) => m);
    if (first) return first[0].input.focus();

    const restore = setLoading(submit, 'Criando sua conta…');
    try {
      const user = await AuthService.signUp({ name: name.value(), email: email.value(), password: password.value() });
      onAuthenticated(user);
    } catch (err) {
      restore();
      if (err.field === 'email') {
        email.setError(err.message);
        email.input.focus();
      } else {
        notice.show(err.message || 'Não foi possível criar sua conta agora.', err.code === 'unconfirmed' ? 'success' : 'error');
      }
    }
  });

  return form;
}
