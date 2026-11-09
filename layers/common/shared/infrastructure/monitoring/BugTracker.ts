import { AWSLambda, captureException } from '@sentry/serverless';
import { Handler } from 'aws-cdk-lib/aws-lambda';
import { Env } from '../../domain/interfaces/IEnvironment';
import { getEnv } from '../../../utils/Utils';

const dsn = getEnv(Env.SENTRY_DSN, '');

export default class BugTracker {
  static init() {
    AWSLambda.init({
      dsn: dsn,
      tracesSampleRate: 1.0,
      environment: getEnv(Env.STAGE),
    });
  }

  /**
   * Encapsula la función handler de lambda
   * @param {function} handler Función a encapsular
   * @param {object} options Objeto con opciones
   */
  static wrapHandler(
    handler: any,
    options: any = {
      timeoutWarningLimit: 50,
    },
  ): Handler {
    return AWSLambda.wrapHandler(handler, options);
  }

  /**
   * Captura una excepción en sentry
   * @param {*} e Excepción a capturar
   * @param {object} options Objeto con opciones
   */
  static captureException(e: any, options?: any): void {
    console.error({
      error: e,
      options: options,
    });

    captureException(e, options);
  }
}

BugTracker.init();
