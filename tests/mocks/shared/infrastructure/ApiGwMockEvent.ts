import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { IAuthorizerContext } from '../../../../layers/common/shared/infrastructure/api/PrivateRequest';

export const AuthorizerContextMock: IAuthorizerContext = {
  organization: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    legacyId: '90207',
  },
  user: {
    email: 'nicolas.montoya@alegra.com',
    id: '550e8400-e29b-41d4-a716-446655440000',
    isAccountant: false,
    legacyBasicToken:
      'bmljb2xhcy5tb250b3lhQGFsZWdyYS5jb206NWRjZWM3YmRmZWY1NmVhZDMwY2E=',
    legacyId: '91955',
  },
  type: 'colombia',
  applicationVersion: 'colombia',
};

export const ApiGwMockEvent = ({
  pathParams = {},
  queryParams = {},
  bodyParams = {},
}: {
  pathParams?: any;
  queryParams?: any;
  bodyParams?: any;
  userName?: string;
}): APIGatewayProxyEventV2WithLambdaAuthorizer<IAuthorizerContext> => ({
  version: '2.0',
  routeKey: '$default',
  rawPath: '/path/to/resource',
  rawQueryString: 'parameter1=value1&parameter1=value2&parameter2=value',
  cookies: ['cookie1', 'cookie2'],
  headers: {
    Authorization: `Bearer `,
    Header2: 'value1,value2',
  },
  queryStringParameters: queryParams,
  requestContext: {
    accountId: '123456789012',
    apiId: 'api-id',
    authentication: {
      clientCert: {
        clientCertPem: 'CERT_CONTENT',
        subjectDN: 'www.example.com',
        issuerDN: 'Example issuer',
        serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
        validity: {
          notBefore: 'May 28 12:30:02 2019 GMT',
          notAfter: 'Aug  5 09:36:04 2021 GMT',
        },
      },
    },
    authorizer: {
      lambda: AuthorizerContextMock,
    },
    domainName: 'id.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'id',
    http: {
      method: 'POST',
      path: '/path/to/resource',
      protocol: 'HTTP/1.1',
      sourceIp: '192.168.0.1/32',
      userAgent: 'agent',
    },
    requestId: 'id',
    routeKey: '$default',
    stage: '$default',
    time: '12/Mar/2020:19:03:58 +0000',
    timeEpoch: 1583348638390,
  },
  body: JSON.stringify(bodyParams),
  pathParameters: pathParams,
  isBase64Encoded: true,
  stageVariables: {
    stageVariable1: 'value1',
    stageVariable2: 'value2',
  },
});
