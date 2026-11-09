import { v7 as uuid } from 'uuid';
import { ValueObject } from './ValueObject';
import { isUUID } from '../../../utils/Utils';
import { ValidationException } from '../exceptions/ValidationException';
import { ErrorCodes, ErrorMessages } from '../interfaces/IError';

export class Uuid extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }

  static random(): Uuid {
    return new Uuid(uuid());
  }

  private ensureIsValidUuid(id: string): void {
    if (!isUUID(id)) {
      throw new ValidationException([
        {
          code: ErrorCodes.PARAM_MUST_BE_UUID,
          message: ErrorMessages.PARAM_MUST_BE_UUID,
          field: this.constructor.name,
        },
      ]);
    }
  }
}
