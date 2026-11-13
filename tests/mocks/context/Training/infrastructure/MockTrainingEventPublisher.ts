import { TrainingEventPublisher } from '../../../../../layers/common/context/Training/domain/TrainingEventPublisher';
import { ITrainingKafkaMessage } from '../../../../../layers/common/context/Training/domain/ITrainingKafkaMessage';

export class MockTrainingEventPublisher implements TrainingEventPublisher {
  public messages: ITrainingKafkaMessage[] = [];

  async publish(message: ITrainingKafkaMessage): Promise<void> {
    this.messages.push(message);
  }
}
