import { ValidationException } from '../../../../shared/domain/exceptions/ValidationException';
import { ErrorCodes } from '../../../../shared/domain/interfaces/IError';
import { DocumentTypeValue } from '../ITraining';

export class DocumentType {
  constructor(readonly value: DocumentTypeValue) {
    if (!Object.values(DocumentTypeValue).includes(value)) {
      throw new ValidationException([
        {
          code: ErrorCodes.INVALID_PARAMS,
          message: `documentType must be one of: ${Object.values(DocumentTypeValue).join(', ')}`,
          field: 'documentType',
        },
      ]);
    }
  }
}
