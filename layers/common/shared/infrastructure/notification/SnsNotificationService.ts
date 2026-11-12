import { NotificationService } from '../../domain/services/NotificationService';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { getEnv } from '../../../utils/Utils';
import { Env } from '../../domain/interfaces/IEnvironment';
import { ExampleEntityEvent } from '../../../context/Example/domain/events/ExampleEntityEvent';
import { TrainingEventSent } from '../../../context/Training/domain/events/TrainingEventSent';
import { BaseEvent } from '../../domain/events/BaseEvent';

export class SnsNotificationService implements NotificationService {
  private sns: SNSClient;
  private readonly topicMap: Map<string, string> = new Map([
    [ExampleEntityEvent.name, getEnv(Env.SNS_EXAMPLE_ENTITY_TOPIC_ARN)],
    [TrainingEventSent.name, getEnv(Env.TRAINING_TOPIC_ARN)],
  ]);

  constructor() {
    this.sns = new SNSClient({
      region: getEnv(Env.AWS_REGION_ID),
    });
  }

  async publish<T>(event: BaseEvent<T>): Promise<void> {
    const eventName = event.constructor.name;
    const topic = this.topicMap.get(eventName);

    if (!topic) {
      console.log(`No SNS topic configured for event: ${eventName}`);
      return;
    }

    const command = new PublishCommand({
      TopicArn: topic,
      Subject: eventName,
      Message: JSON.stringify(event),
    });

    await this.sns.send(command);
  }
}
