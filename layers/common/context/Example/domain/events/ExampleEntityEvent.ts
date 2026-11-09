import { BaseEvent } from '../../../../shared/domain/events/BaseEvent';
import { IExample } from '../IExample';

export class ExampleEntityEvent extends BaseEvent<IExample> {
  readonly type = 'ExampleEntityEvent';
  constructor(payload: IExample) {
    super(payload);
  }
}
