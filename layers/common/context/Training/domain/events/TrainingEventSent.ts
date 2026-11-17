import { BaseEvent } from '../../../../shared/domain/events/BaseEvent';
import { ITrainingEvent } from '../ITrainingEvent';

export class TrainingEventSent extends BaseEvent<ITrainingEvent> {
  readonly type = 'TrainingEventSent';

  constructor(payload: ITrainingEvent) {
    super(payload);
  }
}
