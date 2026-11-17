import { z } from 'zod';
import { HubSpotSignedRequest } from '../../domain/HubSpotSignatureVerifier';

export type ReceiveHubSpotWebhookDTO = HubSpotSignedRequest;

export const HubSpotEventSchema = z.object({
  objectId: z.number().int(),
  propertyName: z.string().min(1),
  propertyValue: z.string(),
  occurredAt: z.number().int(),
});

export const HubSpotWebhookBodySchema = z.array(HubSpotEventSchema);
