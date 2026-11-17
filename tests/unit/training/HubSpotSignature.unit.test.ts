import { describe, expect, test } from '@jest/globals';
import { buildHubSpotSignature } from '../../../layers/common/context/Training/infrastructure/SsmHubSpotSignatureVerifier';

describe('HubSpot signature', () => {
  test('matches the HubSpot v3 HMAC-SHA256 base64 of method, uri, body and timestamp', () => {
    const signature = buildHubSpotSignature('test-secret', {
      requestMethod: 'POST',
      requestUri: 'https://example.com/v1/training/hubspot-webhook',
      requestBody: '[{"objectId":1}]',
      requestTimestamp: '1794581333000',
    });

    expect(signature).toBe('A8Rz8d0bipdfxCwcOYVCCRANbtdesR0Fx7Oaknw3yBY=');
  });

  test('changes when the body changes', () => {
    const base = {
      requestMethod: 'POST',
      requestUri: 'https://example.com/v1/training/hubspot-webhook',
      requestTimestamp: '1794581333000',
    };

    expect(
      buildHubSpotSignature('test-secret', { ...base, requestBody: '[]' }),
    ).not.toBe(
      buildHubSpotSignature('test-secret', {
        ...base,
        requestBody: '[{"objectId":1}]',
      }),
    );
  });
});
