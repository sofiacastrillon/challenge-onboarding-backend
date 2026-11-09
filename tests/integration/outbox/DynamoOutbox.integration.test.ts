import { describe, test, expect, beforeAll } from '@jest/globals';
import { DynamoOutboxRepository } from '../../../layers/common/context/Outbox/infrastructure/DynamoOutboxRepository';
import { MockOutbox } from '../../mocks/context/Outbox/domain/MockOutbox';
import { OutboxStatusValue } from '../../../layers/common/context/Outbox/domain/IOutbox';
import { Env } from '../../../layers/common/shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../../layers/common/utils/Utils';
import { Outbox } from '../../../layers/common/context/Outbox/domain/Outbox';

describe('Dynamo Outbox Integration', () => {
  let outboxRepository: DynamoOutboxRepository;

  beforeAll(() => {
    process.env.OUTBOX_TABLE_NAME = getEnv(
      Env.OUTBOX_INTEGRATION_TEST_TABLE_NAME,
    );
    outboxRepository = new DynamoOutboxRepository();
  });

  test('should create a new outbox', async () => {
    const outbox = await outboxRepository.create(MockOutbox);
    expect(outbox).toEqual(MockOutbox);
  });

  test('should update a outbox', async () => {
    const outbox = await outboxRepository.update(MockOutbox);
    expect(outbox).toEqual(MockOutbox);
  });

  test('should find a outbox by id', async () => {
    const outbox = await outboxRepository.findById(MockOutbox.id);
    expect(outbox).not.toBeNull();
  });

  test('should find all outbox by status', async () => {
    const outbox = await outboxRepository.findAllByStatus(
      OutboxStatusValue.PENDING,
    );

    const expectedOutbox = outbox.filter(outbox => outbox.id === MockOutbox.id);

    expect(expectedOutbox).not.toBeNull();
  });

  test('should find all delayed events', async () => {
    const outbox = await outboxRepository.findAllDelayedEvents(500);
    const expectedOutbox = outbox.filter(outbox => outbox.id === MockOutbox.id);
    expect(expectedOutbox).not.toBeNull();
  });

  test('should update retries', async () => {
    await outboxRepository.updateRetries(MockOutbox);
  });

  test('should delete a outbox', async () => {
    const outboxes = await outboxRepository.findAllByStatus(
      OutboxStatusValue.PENDING,
    );

    const promises = outboxes.map(async (outbox: Outbox) => {
      await outboxRepository.delete(outbox);
    });

    await Promise.all(promises);
  });
});
