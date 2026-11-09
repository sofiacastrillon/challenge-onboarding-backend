export class ForbiddenException extends Error {
  readonly statusCode = 403;

  constructor(message: string) {
    super(message);
  }
}
