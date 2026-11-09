import { BaseEvent } from '../../../../shared/domain/events/BaseEvent';
import { IOutbox } from '../IOutbox';

export class OutboxEntityEvent extends BaseEvent<IOutbox> {
  readonly type = 'OutboxEntityEvent';
  constructor(payload: IOutbox) {
    super(payload);
  }
}
