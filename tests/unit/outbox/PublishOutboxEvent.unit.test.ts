import { describe, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { MockOutbox } from '../../mocks/context/Outbox/domain/MockOutbox';
import { PublishOutboxEvent } from '../../../layers/common/context/Outbox/application/PublishOutboxEvent';

describe('PublishOutboxEvent', () => {
  test('should publish outbox event successfully', async () => {
    const publishOutboxEventApplication =
      DependencyInjection.resolve(PublishOutboxEvent);
    await publishOutboxEventApplication.run(MockOutbox.toObject());
  });
});
