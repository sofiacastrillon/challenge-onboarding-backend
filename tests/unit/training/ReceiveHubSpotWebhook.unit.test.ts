import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { ReceiveHubSpotWebhook } from '../../../layers/common/context/Training/application/ReceiveHubSpotWebhook';
import { TOKENS } from '../../../layers/common/shared/application/di/Tokens';
import { MockHubSpotEventRepository } from '../../mocks/context/Training/infrastructure/MockHubSpotEventRepository';
import { MockHubSpotSignatureVerifier } from '../../mocks/context/Training/infrastructure/MockHubSpotSignatureVerifier';
import { MockNotificationService } from '../../mocks/shared/infrastructure/MockNotificationService';
import AuthenticationException from '../../../layers/common/shared/domain/exceptions/AuthenticationException';
import { ValidationException } from '../../../layers/common/shared/domain/exceptions/ValidationException';

const occurredAt = 1794581333000;

const buildRequest = (
  requestBody: string,
  requestTimestamp: string = String(Date.now()),
) => ({
  requestMethod: 'POST',
  requestUri: 'https://example.com/v1/training/hubspot-webhook',
  requestBody,
  requestTimestamp,
  signature: 'signature',
});

const validBody = JSON.stringify([
  {
    objectId: 123,
    propertyName: 'dealstage',
    propertyValue: 'closedwon',
    occurredAt,
  },
]);

describe('Receive HubSpot Webhook', () => {
  test('saves each event and publishes it as a training event', async () => {
    const useCase = DependencyInjection.resolve(ReceiveHubSpotWebhook);
    const repository = DependencyInjection.resolve<MockHubSpotEventRepository>(
      TOKENS.HubSpotEventRepository,
    );
    const notifications = DependencyInjection.resolve<MockNotificationService>(
      TOKENS.NotificationService,
    );

    const result = await useCase.run(buildRequest(validBody));

    expect(result).toEqual({ received: 1 });
    expect(repository.saved).toEqual([
      {
        objectId: 123,
        propertyName: 'dealstage',
        propertyValue: 'closedwon',
        occurredAt,
      },
    ]);
    expect(notifications.events).toHaveLength(1);
    expect(notifications.events[0].payload).toEqual({
      eventType: 'hubspot.propertyChange',
      datetime: new Date(occurredAt).toISOString(),
      timestamp: 1794581333,
    });
  });

  test('rejects an invalid signature and saves nothing', async () => {
    const verifier = DependencyInjection.resolve<MockHubSpotSignatureVerifier>(
      TOKENS.HubSpotSignatureVerifier,
    );
    verifier.valid = false;
    const repository = DependencyInjection.resolve<MockHubSpotEventRepository>(
      TOKENS.HubSpotEventRepository,
    );
    const useCase = DependencyInjection.resolve(ReceiveHubSpotWebhook);

    await expect(useCase.run(buildRequest(validBody))).rejects.toThrow(
      AuthenticationException,
    );
    expect(repository.saved).toEqual([]);
  });

  test('rejects a request older than 5 minutes', async () => {
    const useCase = DependencyInjection.resolve(ReceiveHubSpotWebhook);
    const sixMinutesAgo = String(Date.now() - 6 * 60 * 1000);

    await expect(
      useCase.run(buildRequest(validBody, sixMinutesAgo)),
    ).rejects.toThrow('older than 5 minutes');
  });

  test('rejects a missing timestamp', async () => {
    const useCase = DependencyInjection.resolve(ReceiveHubSpotWebhook);

    await expect(useCase.run(buildRequest(validBody, ''))).rejects.toThrow(
      AuthenticationException,
    );
  });

  test('rejects a body that is not an array of events', async () => {
    const useCase = DependencyInjection.resolve(ReceiveHubSpotWebhook);

    await expect(
      useCase.run(buildRequest(JSON.stringify({ objectId: 1 }))),
    ).rejects.toThrow(ValidationException);
  });

  test('rejects a body that is not valid JSON', async () => {
    const useCase = DependencyInjection.resolve(ReceiveHubSpotWebhook);

    await expect(useCase.run(buildRequest('not-json'))).rejects.toThrow(
      ValidationException,
    );
  });
});
