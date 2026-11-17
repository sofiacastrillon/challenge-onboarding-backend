import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { NotificationService } from '../../../shared/domain/services/NotificationService';
import { TrainingEventSent } from '../domain/events/TrainingEventSent';
import { ITrainingEvent } from '../domain/ITrainingEvent';
import { SendTrainingEventDTO } from './DTO/SendTrainingEventDTO';

@injectable()
export class SendTrainingEvent {
  constructor(
    @inject(TOKENS.NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  async run(dto: SendTrainingEventDTO): Promise<ITrainingEvent> {
    const payload: ITrainingEvent = {
      eventType: dto.eventType,
      datetime: dto.datetime,
      timestamp: dto.timestamp,
    };

    await this.notificationService.publish(new TrainingEventSent(payload));

    return payload;
  }
}
