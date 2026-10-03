/** Erro de autenticação com código e campo do formulário relacionado. */
export class AuthError extends Error {
  constructor(code, message, field) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.field = field;
  }
}
