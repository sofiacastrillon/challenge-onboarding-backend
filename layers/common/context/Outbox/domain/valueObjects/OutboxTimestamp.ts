import { ValueObject } from '../../../../shared/domain/valueObjects/ValueObject';

export class OutboxTimestamp extends ValueObject<Date> {
  constructor(value: string) {
    super(new Date(value));
  }

  toString(): string {
    return this.value.toISOString();
  }
}
