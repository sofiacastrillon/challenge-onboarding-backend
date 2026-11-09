import { ValueObject } from './ValueObject';

export class CreatedAt extends ValueObject<Date | null> {
  constructor(value: string | null) {
    if (value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
    }

    super(value ? new Date(value) : null);
  }

  toString(): string {
    return this.value?.toISOString() || '';
  }
}
