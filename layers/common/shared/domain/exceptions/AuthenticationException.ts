export default class AuthenticationException extends Error {
  readonly statusCode = 401;

  constructor() {
    super('Unauthorized');
  }
}
