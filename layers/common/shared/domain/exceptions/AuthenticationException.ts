export default class AuthenticationException extends Error {
  readonly statusCode = 401;

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
