import { OutboxEventTypeValue } from '../IOutbox';

export class OutboxEventType {
  constructor(readonly value: OutboxEventTypeValue) {
    if (
      !Object.values(OutboxEventTypeValue).includes(
        value as OutboxEventTypeValue,
      )
    ) {
      throw new Error('Invalid OutboxEventTypeValue');
    }
  }
}
