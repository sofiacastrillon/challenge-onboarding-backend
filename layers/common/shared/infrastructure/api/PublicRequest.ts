import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { AbstractRequest } from './AbstractRequest';

export class PublicRequest extends AbstractRequest {
  constructor(event: APIGatewayProxyEventV2) {
    super(event);
  }
}
