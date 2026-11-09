import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidationException } from '../../domain/exceptions/ValidationException';
import { Stage } from '../../domain/interfaces/IStage';
import { IBodyParams } from '../../domain/interfaces/IRequest';
import { getEnv, isDebugStage } from '../../../utils/Utils';
import { Env } from '../../domain/interfaces/IEnvironment';
import {
  ErrorCodes,
  ErrorMessages,
  IErrors,
} from '../../domain/interfaces/IError';

export abstract class AbstractRequest {
  protected validationErrors: IErrors[] = [];

  constructor(protected readonly event: APIGatewayProxyEventV2) {
    const stage = getEnv(Env.STAGE) as Stage;

    if (isDebugStage(stage)) {
      console.log(event);
    } else {
      console.log(this.getSafeEventLog());
    }
  }

  getPathParameters(): { [key: string]: string } {
    return (this.event?.pathParameters || {}) as { [key: string]: string };
  }

  getQueryParameters(): { [key: string]: string } {
    return (this.event?.queryStringParameters || {}) as {
      [key: string]: string;
    };
  }

  getBodyParameter(): IBodyParams {
    try {
      return JSON.parse(this.event?.body || '{}');
    } catch {
      throw new ValidationException([
        {
          code: ErrorCodes.INVALID_BODY_REQUEST,
          message: ErrorMessages.INVALID_BODY_REQUEST,
        },
      ]);
    }
  }

  private getSafeEventLog() {
    const {
      requestContext,
      isBase64Encoded,
      headers,
      pathParameters,
      queryStringParameters,
    } = this.event;

    return {
      method: requestContext.http.method,
      path: requestContext.http.method,
      sourceIp: requestContext.http.sourceIp,
      pathParameters,
      isBase64Encoded,
      queryStringParameters,
      headers: {
        'user-agent': headers['user-agent'],
        'x-forwarded-for': headers['x-forwarded-for'],
        host: headers.host,
      },
      time: requestContext.time,
      timeEpoch: requestContext.timeEpoch,
      requestId: requestContext.requestId,
      traceId: headers['x-trace-id'] || headers['x-amzn-trace-id'] || 'N/A',
    };
  }
}
