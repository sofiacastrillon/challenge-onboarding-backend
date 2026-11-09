import { BaseEvent } from '../../../../shared/domain/events/BaseEvent';
import { IOutbox } from '../IOutbox';

export class OutboxFailedEvent extends BaseEvent<IOutbox> {
  readonly type = 'OutboxFailedEvent';
  constructor(payload: IOutbox) {
    super(payload);
  }
}
