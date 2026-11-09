import {
  OutboxEventTypeValue,
  OutboxStatusValue,
} from '../../../../../layers/common/context/Outbox/domain/IOutbox';
import { Outbox } from '../../../../../layers/common/context/Outbox/domain/Outbox';
import { EntityTypeValue } from '../../../../../layers/common/shared/domain/BaseEntity';
import { AuthorizerContextMock } from '../../../shared/infrastructure/ApiGwMockEvent';
import { v7 } from 'uuid';

export const MockOutbox: Outbox = Outbox.fromObject({
  id: v7(),
  idCompany: AuthorizerContextMock.organization.legacyId,
  entityId: v7(),
  entityType: EntityTypeValue.EXAMPLE,
  eventType: OutboxEventTypeValue.NEW,
  payload: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test 1',
  },
  status: OutboxStatusValue.PENDING,
  retries: 0,
  timestamp: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
