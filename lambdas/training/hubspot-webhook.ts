import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { ReceiveHubSpotWebhook } from '/opt/nodejs/context/Training/application/ReceiveHubSpotWebhook';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';

interface HubSpotWebhookRequest {
  headers: Record<string, string | undefined>;
  body?: string | null;
  isBase64Encoded?: boolean;
  rawPath: string;
  rawQueryString?: string;
  requestContext: {
    domainName: string;
    http: { method: string };
  };
}

const getHeader = (
  headers: Record<string, string | undefined>,
  name: string,
): string => {
  const key = Object.keys(headers).find(
    header => header.toLowerCase() === name.toLowerCase(),
  );
  return (key && headers[key]) || '';
};

export const hubSpotWebhook = async (event: HubSpotWebhookRequest) => {
  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
      : (event.body ?? '');
    const query = event.rawQueryString ? `?${event.rawQueryString}` : '';

    const useCase = DependencyInjection.resolve(ReceiveHubSpotWebhook);
    const result = await useCase.run({
      requestMethod: event.requestContext.http.method,
      requestUri: `https://${event.requestContext.domainName}${event.rawPath}${query}`,
      requestBody: rawBody,
      requestTimestamp: getHeader(event.headers, 'X-HubSpot-Request-Timestamp'),
      signature: getHeader(event.headers, 'X-HubSpot-Signature-v3'),
    });

    return Response.format(200, result);
  } catch (error) {
    return Response.handleException(error);
  }
};

export const handler = BugTracker.wrapHandler(hubSpotWebhook);
