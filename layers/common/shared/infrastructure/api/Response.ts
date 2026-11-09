import { ValidationException } from '../../domain/exceptions/ValidationException';
import BugTracker from '../monitoring/BugTracker';
import { getEnv } from '../../../utils/Utils';
import { Env } from '../../domain/interfaces/IEnvironment';
import { Stage } from '../../domain/interfaces/IStage';
import { isDebugStage } from '../../../utils/Utils';

const NOT_REPORT_TO_SENTRY = [404, 400];

export class Response {
  static format(statusCode: number, message: any) {
    return {
      statusCode: statusCode,
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  static handleException(e: any) {
    const stage = getEnv(Env.STAGE) as Stage;
    const isDebug = isDebugStage(stage);

    const statusCode = e.statusCode || 500;

    const shouldHideMessage = statusCode >= 500 && !isDebug;
    const message = shouldHideMessage
      ? 'Internal server error'
      : e.message || 'Unexpected error';

    if (!NOT_REPORT_TO_SENTRY.includes(statusCode))
      BugTracker.captureException(e);

    if (e instanceof ValidationException) {
      return Response.format(statusCode, { errors: e.errors });
    }

    return Response.format(statusCode, {
      code: statusCode,
      message: message,
    });
  }
}
