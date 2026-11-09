import { Outbox } from './Outbox';
import { OutboxEventTypeValue, OutboxStatusValue } from './IOutbox';
import { BaseEntity } from '../../../shared/domain/BaseEntity';

export interface OutboxRepository {
  getDatabaseName(): string;
  create(outbox: Outbox): Promise<Outbox>;
  update(outbox: Outbox): Promise<Outbox>;
  findById(id: string): Promise<Outbox | null>;
  findAllByStatus(status: OutboxStatusValue): Promise<Outbox[]>;
  findAllDelayedEvents(delay: number): Promise<Outbox[]>;
  updateRetries(outbox: Outbox): Promise<void>;
  transformEntityEventToOutboxRecord(
    entity: BaseEntity,
    eventType: OutboxEventTypeValue,
  ): any;
}
