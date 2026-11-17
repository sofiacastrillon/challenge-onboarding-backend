import { StringValueObject } from '../../../../shared/domain/valueObjects/StringValueObject';
import { ValidationException } from '../../../../shared/domain/exceptions/ValidationException';
import { ErrorCodes } from '../../../../shared/domain/interfaces/IError';

export class IdUser extends StringValueObject {
  constructor(value: string) {
    super(value);

    if (!value.trim()) {
      throw new ValidationException([
        {
          code: ErrorCodes.INVALID_PARAMS,
          message: 'idUser is required',
          field: 'idUser',
        },
      ]);
    }
  }
}
