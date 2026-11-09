import { describe, it, expect } from '@jest/globals';
import { publishEvent } from '../../../lambdas/outbox/publish-event';
import { publishStuckEvents } from '../../../lambdas/outbox/publish-stuck-events';
import { createOutboxStreamEvent } from '../../mocks/shared/infrastructure/DynamoStreamMockEvent';
import { EventBridgeMockEvent } from '../../mocks/shared/infrastructure/EventBridgeMockEvent';

describe('Outbox acceptance tests', () => {
  it('Given a Outbox Data, when we publish an event, then we receive a successful response', async () => {
    const mockEvent = createOutboxStreamEvent('INSERT', {
      id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
      entityId: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
      entityType: 'EXAMPLE',
      eventType: 'NEW',
      payload: { idCompany: '123', name: 'Test Organization' },
      status: 'PENDING',
      retries: 0,
      timestamp: '2021-01-01T00:00:00.000Z',
      idCompany: '123',
    });

    const result = await publishEvent(mockEvent);

    expect(result?.batchItemFailures).toEqual([]);
  });

  it('Given a scheduled event, when we publish stuck events, then we receive a successful response', async () => {
    const mockEvent = EventBridgeMockEvent({
      source: 'aws.events',
      detailType: 'Scheduled Event',
      detail: {},
    });

    await publishStuckEvents(mockEvent);
  });
});
