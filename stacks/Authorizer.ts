import { Construct } from 'constructs';
import { PROJECT_NAME } from './constants';
import {
  CfnAuthorizer,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpRouteAuthorizer,
} from 'aws-cdk-lib/aws-apigatewayv2';
import { Function, IFunction } from 'aws-cdk-lib/aws-lambda';
import { Env } from '../layers/common/shared/domain/interfaces/IEnvironment';
import { getEnv } from '../layers/common/utils/Utils';
import { Duration, Stack } from 'aws-cdk-lib';

/**
 * Custom HTTP Lambda Authorizer with IAM response type and payload format version 2.0
 */
class CustomHttpLambdaAuthorizer implements IHttpRouteAuthorizer {
  private authorizer?: CfnAuthorizer;

  readonly authorizationType = 'CUSTOM';

  constructor(
    private readonly id: string,
    private readonly handler: IFunction,
    private readonly props: {
      authorizerName: string;
      identitySource: string[];
      resultsCacheTtl?: Duration;
    },
  ) {}

  bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (!this.authorizer) {
      const stack = Stack.of(options.scope);

      this.authorizer = new CfnAuthorizer(options.scope, this.id, {
        apiId: options.route.httpApi.apiId,
        authorizerType: 'REQUEST',
        name: this.props.authorizerName,
        authorizerUri: `arn:aws:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${this.handler.functionArn}/invocations`,
        identitySource: this.props.identitySource,
        authorizerPayloadFormatVersion: '2.0',
        authorizerResultTtlInSeconds:
          this.props.resultsCacheTtl?.toSeconds() ?? 300,
        enableSimpleResponses: false, // IAM policy response
      });
    }

    return {
      authorizerId: this.authorizer.ref,
      authorizationType: this.authorizationType,
    };
  }
}

export let Authorizer: IHttpRouteAuthorizer;

export const initializeAuthorizer = (app: Construct) => {
  const authHandler = Function.fromFunctionArn(
    app,
    `authorizer-${PROJECT_NAME}`,
    getEnv(Env.LAMBDA_AUTHORIZER_ARN, ''),
  );

  const isProduction = getEnv(Env.STAGE, 'development') === 'production';

  Authorizer = new CustomHttpLambdaAuthorizer(
    `authorizer-${PROJECT_NAME}`,
    authHandler,
    {
      identitySource: ['$request.header.Authorization', '$context.path'],
      authorizerName: `authorizer-${PROJECT_NAME}`,
      resultsCacheTtl: isProduction ? Duration.minutes(5) : Duration.minutes(1),
    },
  );
};
