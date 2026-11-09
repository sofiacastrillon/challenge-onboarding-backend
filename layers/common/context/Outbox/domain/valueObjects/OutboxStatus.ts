import { OutboxStatusValue } from '../IOutbox';

export class OutboxStatus {
  constructor(readonly value: OutboxStatusValue) {
    if (
      !Object.values(OutboxStatusValue).includes(value as OutboxStatusValue)
    ) {
      throw new Error('Invalid OutboxStatusValue');
    }
  }
}
