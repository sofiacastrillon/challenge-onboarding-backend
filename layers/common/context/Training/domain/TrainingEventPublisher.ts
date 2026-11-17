import { ITrainingKafkaMessage } from './ITrainingKafkaMessage';

export interface TrainingEventPublisher {
  publish(message: ITrainingKafkaMessage): Promise<void>;
}
