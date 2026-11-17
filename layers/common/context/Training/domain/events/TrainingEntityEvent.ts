import { BaseEvent } from '../../../../shared/domain/events/BaseEvent';
import { ITraining } from '../ITraining';

export class TrainingEntityEvent extends BaseEvent<ITraining> {
  readonly type = 'TrainingEntityEvent';

  constructor(payload: ITraining) {
    super(payload);
  }
}
