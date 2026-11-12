import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { TrainingEventPublisher } from '../domain/TrainingEventPublisher';
import { ITrainingKafkaMessage } from '../domain/ITrainingKafkaMessage';
import { SendTrainingEventDTO } from './DTO/SendTrainingEventDTO';

export const TRAINING_KAFKA_TEXT =
  'Esto es un evento escrito desde una lambda que escucha eventos desde SQS';

@injectable()
export class PublishTrainingEventToKafka {
  constructor(
    @inject(TOKENS.TrainingEventPublisher)
    private readonly trainingEventPublisher: TrainingEventPublisher,
  ) {}

  async run(dto: SendTrainingEventDTO): Promise<ITrainingKafkaMessage> {
    const message: ITrainingKafkaMessage = {
      text: TRAINING_KAFKA_TEXT,
      eventType: dto.eventType,
      datetime: dto.datetime,
      timestamp: dto.timestamp,
    };

    await this.trainingEventPublisher.publish(message);

    return message;
  }
}
