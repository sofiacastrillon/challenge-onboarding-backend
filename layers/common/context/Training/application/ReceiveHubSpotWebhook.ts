import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { NotificationService } from '../../../shared/domain/services/NotificationService';
import AuthenticationException from '../../../shared/domain/exceptions/AuthenticationException';
import { ValidationException } from '../../../shared/domain/exceptions/ValidationException';
import { IHubSpotEvent } from '../domain/IHubSpotEvent';
import { HubSpotEventRepository } from '../domain/HubSpotEventRepository';
import { HubSpotSignatureVerifier } from '../domain/HubSpotSignatureVerifier';
import { TrainingEventSent } from '../domain/events/TrainingEventSent';
import {
  HubSpotWebhookBodySchema,
  ReceiveHubSpotWebhookDTO,
} from './DTO/ReceiveHubSpotWebhookDTO';

export const HUBSPOT_TRAINING_EVENT_TYPE = 'hubspot.propertyChange';
const MAX_REQUEST_AGE_MS = 5 * 60 * 1000;

@injectable()
export class ReceiveHubSpotWebhook {
  constructor(
    @inject(TOKENS.HubSpotSignatureVerifier)
    private readonly signatureVerifier: HubSpotSignatureVerifier,
    @inject(TOKENS.HubSpotEventRepository)
    private readonly eventRepository: HubSpotEventRepository,
    @inject(TOKENS.NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  async run(dto: ReceiveHubSpotWebhookDTO): Promise<{ received: number }> {
    this.assertFreshRequest(dto.requestTimestamp);

    const isValid = await this.signatureVerifier.isValid(dto);
    if (!isValid) {
      throw new AuthenticationException('Invalid HubSpot signature');
    }

    const events = this.parseBody(dto.requestBody);

    await Promise.all(
      events.map(async event => {
        await this.eventRepository.save(event);
        await this.notificationService.publish(
          new TrainingEventSent({
            eventType: HUBSPOT_TRAINING_EVENT_TYPE,
            datetime: new Date(event.occurredAt).toISOString(),
            timestamp: Math.floor(event.occurredAt / 1000),
          }),
        );
      }),
    );

    return { received: events.length };
  }

  private assertFreshRequest(requestTimestamp: string): void {
    const requestedAt = Number(requestTimestamp);
    const isFresh =
      Number.isFinite(requestedAt) &&
      Math.abs(Date.now() - requestedAt) <= MAX_REQUEST_AGE_MS;

    if (!isFresh) {
      throw new AuthenticationException(
        'HubSpot request timestamp is missing or older than 5 minutes',
      );
    }
  }

  private parseBody(requestBody: string): IHubSpotEvent[] {
    let json: unknown;
    try {
      json = JSON.parse(requestBody);
    } catch {
      throw new ValidationException([
        { code: 'invalid_json', message: 'Body must be valid JSON' },
      ]);
    }

    const result = HubSpotWebhookBodySchema.safeParse(json);
    if (!result.success) {
      throw new ValidationException(
        result.error.issues.map(issue => ({
          code: issue.code,
          message: issue.message,
          field: issue.path.join('.'),
        })),
      );
    }

    return result.data;
  }
}
