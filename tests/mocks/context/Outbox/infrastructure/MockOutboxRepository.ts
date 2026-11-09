import { Outbox } from '../../../../../layers/common/context/Outbox/domain/Outbox';
import { MockOutbox } from '../domain/MockOutbox';
import { OutboxRepository } from '../../../../../layers/common/context/Outbox/domain/OutboxRepository';
import {
  OutboxEventTypeValue,
  OutboxStatusValue,
} from '../../../../../layers/common/context/Outbox/domain/IOutbox';
import { BaseEntity } from '../../../../../layers/common/shared/domain/BaseEntity';

export class MockOutboxRepository implements OutboxRepository {
  create(outbox: Outbox): Promise<Outbox> {
    outbox.setCreatedAt(new Date().toISOString());
    outbox.setUpdatedAt(new Date().toISOString());
    return Promise.resolve(outbox);
  }

  update(outbox: Outbox): Promise<Outbox> {
    return Promise.resolve(outbox);
  }

  findById(id: string): Promise<Outbox | null> {
    console.log('findById', id);
    return Promise.resolve(MockOutbox);
  }

  findAllByStatus(status: OutboxStatusValue): Promise<Outbox[]> {
    console.log('findAllByStatus', status);
    return Promise.resolve([MockOutbox]);
  }

  findAllDelayedEvents(delay: number): Promise<Outbox[]> {
    console.log('findAllDelayedEvents', delay);
    return Promise.resolve([MockOutbox]);
  }

  transformEntityEventToOutboxRecord(
    entity: BaseEntity,
    eventType: OutboxEventTypeValue,
  ): any {
    return {
      id: '550e8400-e29b-41d4-a716-446655440000',
      entityId: '550e8400-e29b-41d4-a716-446655440000',
      entityType: entity.getEntityType(),
      eventType: eventType,
      payload: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test 1',
      },
      status: OutboxStatusValue.PENDING,
      retries: 0,
      timestamp: 1717756800000,
    };
  }

  getDatabaseName(): string {
    return 'mock';
  }

  updateRetries(outbox: Outbox): Promise<void> {
    console.log('updateRetries', outbox);
    return Promise.resolve();
  }
}
