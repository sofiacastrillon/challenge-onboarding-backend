import {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';

export interface IBodyParams {
  [key: string]: any;
}

export type IRequestParams = {
  pathParams: APIGatewayProxyEventPathParameters | null;
  queryParams: APIGatewayProxyEventQueryStringParameters | null;
  bodyParams: IBodyParams | null;
};
