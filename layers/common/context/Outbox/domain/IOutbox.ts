import {
  IBaseEntity,
  EntityTypeValue,
} from '../../../shared/domain/BaseEntity';

export const OutboxStatusValue = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
} as const;

export type OutboxStatusValue =
  (typeof OutboxStatusValue)[keyof typeof OutboxStatusValue];

export const OutboxEventTypeValue = {
  NEW: 'NEW',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
} as const;

export type OutboxEventTypeValue =
  (typeof OutboxEventTypeValue)[keyof typeof OutboxEventTypeValue];

export interface IOutbox extends IBaseEntity {
  id: string;
  entityId: string;
  entityType: EntityTypeValue;
  eventType: OutboxEventTypeValue;
  payload: any;
  status: OutboxStatusValue;
  retries: number;
  timestamp: string;
}
