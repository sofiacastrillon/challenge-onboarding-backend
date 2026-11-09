import { describe, test } from '@jest/globals';
import { PublishStuckOutboxEvents } from '../../../layers/common/context/Outbox/application/PublishStuckOutboxEvents';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';

describe('PublishStuckOutboxEvents', () => {
  test('should publish outbox event with pending status', async () => {
    const publishOutboxEventApplication = DependencyInjection.resolve(
      PublishStuckOutboxEvents,
    );
    await publishOutboxEventApplication.run();
  });
});
