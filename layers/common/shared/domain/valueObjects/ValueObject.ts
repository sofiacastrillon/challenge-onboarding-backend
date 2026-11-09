import { ErrorCodes, ErrorMessages } from '../interfaces/IError';
import { ValidationException } from '../exceptions/ValidationException';

export type Primitives = string | string | number | boolean | Date | null;

export abstract class ValueObject<T extends Primitives> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.ensureValueIsDefined(value);
  }

  private ensureValueIsDefined(value: T): void {
    if (value === undefined) {
      throw new ValidationException([
        {
          code: ErrorCodes.INVALID_PARAMS,
          message: ErrorMessages.INVALID_PARAMS,
          field: this.constructor.name,
        },
      ]);
    }
  }

  equals(other: ValueObject<T>): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.value === this.value
    );
  }
}
