import { NumberValueObject } from '../../../../shared/domain/valueObjects/IntValueObject';

export class OutboxRetries extends NumberValueObject {
  constructor(value: number) {
    if (value < 0) {
      throw new Error('Invalid OutboxRetriesValue');
    }
    super(value);
  }
}
