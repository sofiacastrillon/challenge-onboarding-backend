export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export class ValidationException extends Error {
  readonly errors: ValidationError[];
  readonly statusCode: number = 400;

  constructor(errors: ValidationError[]) {
    super('Validation errors occurred');
    this.errors = errors;
  }
}
