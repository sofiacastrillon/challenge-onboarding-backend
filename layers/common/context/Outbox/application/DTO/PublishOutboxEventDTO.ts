import { z } from 'zod';
import { EntityTypeValue } from '../../../../shared/domain/BaseEntity';
import { OutboxEventTypeValue, OutboxStatusValue } from '../../domain/IOutbox';

export const PublishOutboxEventSchema = z.object({
  id: z.string(),
  entityId: z.string(),
  idCompany: z.string(),
  entityType: z.nativeEnum(EntityTypeValue),
  eventType: z.nativeEnum(OutboxEventTypeValue),
  payload: z.string(),
  status: z.nativeEnum(OutboxStatusValue),
  retries: z.number(),
  timestamp: z.string(),
});

export type PublishOutboxEventDTO = z.infer<typeof PublishOutboxEventSchema>;
