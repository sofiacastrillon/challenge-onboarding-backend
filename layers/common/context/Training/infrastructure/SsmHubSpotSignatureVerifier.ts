import { createHmac, timingSafeEqual } from 'crypto';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import {
  HubSpotSignatureVerifier,
  HubSpotSignedRequest,
} from '../domain/HubSpotSignatureVerifier';

export const HUBSPOT_WEBHOOK_SECRET_PARAM =
  '/challenge-onboarding-sofia/hubspot/webhook-secret';

type SignedFields = Omit<HubSpotSignedRequest, 'signature'>;

/**
 * HubSpot v3 signature: base64(HMAC-SHA256(secret, method + uri + body + timestamp))
 */
export const buildHubSpotSignature = (
  secret: string,
  request: SignedFields,
): string =>
  createHmac('sha256', secret)
    .update(
      `${request.requestMethod}${request.requestUri}${request.requestBody}${request.requestTimestamp}`,
    )
    .digest('base64');

export class SsmHubSpotSignatureVerifier implements HubSpotSignatureVerifier {
  private secret?: string;

  async isValid(request: HubSpotSignedRequest): Promise<boolean> {
    const secret = await this.getSecret();
    const expected = Buffer.from(buildHubSpotSignature(secret, request));
    const received = Buffer.from(request.signature);

    return (
      expected.length === received.length && timingSafeEqual(expected, received)
    );
  }

  private async getSecret(): Promise<string> {
    if (this.secret) {
      return this.secret;
    }

    const response = await new SSMClient({}).send(
      new GetParameterCommand({
        Name: HUBSPOT_WEBHOOK_SECRET_PARAM,
        WithDecryption: true,
      }),
    );

    const value = response.Parameter?.Value;
    if (!value) {
      throw new Error(`Missing SSM parameter: ${HUBSPOT_WEBHOOK_SECRET_PARAM}`);
    }

    this.secret = value;
    return value;
  }
}
