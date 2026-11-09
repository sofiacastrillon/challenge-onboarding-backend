import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { AbstractRequest } from './AbstractRequest';
import AuthenticationException from '../../domain/exceptions/AuthenticationException';

export interface IAuthorizerContext {
  organization: {
    id: string;
    legacyId: string;
  };
  user: {
    email: string;
    id: string;
    isAccountant: boolean;
    legacyBasicToken: string;
    legacyId: string;
  };
  type: string;
  applicationVersion: string;
}

export class PrivateRequest extends AbstractRequest {
  protected token: string = '';
  protected tokenInfo: IAuthorizerContext;
  protected requestContext: APIGatewayProxyEventV2WithLambdaAuthorizer<IAuthorizerContext>;

  constructor(
    event: APIGatewayProxyEventV2WithLambdaAuthorizer<IAuthorizerContext>,
  ) {
    super(event);

    if (!event.requestContext.authorizer?.lambda)
      throw new AuthenticationException();

    this.tokenInfo = event.requestContext.authorizer.lambda;
  }

  getToken(): string {
    return this.token;
  }

  getTokenInfo(): IAuthorizerContext {
    return this.tokenInfo;
  }
}
