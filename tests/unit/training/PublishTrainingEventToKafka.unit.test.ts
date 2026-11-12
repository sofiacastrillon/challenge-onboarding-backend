import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { PublishTrainingEventToKafka } from '../../../layers/common/context/Training/application/PublishTrainingEventToKafka';
import { TOKENS } from '../../../layers/common/shared/application/di/Tokens';
import { MockTrainingEventPublisher } from '../../mocks/context/Training/infrastructure/MockTrainingEventPublisher';

const payload = {
  eventType: 'training.created',
  datetime: '2026-11-11T10:00:00-05:00',
  timestamp: 1794431907,
};

describe('Publish Training Event To Kafka', () => {
  test('publishes the fixed text merged with the event payload', async () => {
    const publishTrainingEventToKafka = DependencyInjection.resolve(
      PublishTrainingEventToKafka,
    );
    const publisher = DependencyInjection.resolve<MockTrainingEventPublisher>(
      TOKENS.TrainingEventPublisher,
    );

    const result = await publishTrainingEventToKafka.run(payload);

    expect(result).toEqual({
      text: 'Esto es un evento escrito desde una lambda que escucha eventos desde SQS',
      ...payload,
    });
    expect(publisher.messages).toEqual([result]);
  });
});
