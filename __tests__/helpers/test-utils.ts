import { APIGatewayProxyWithCognitoAuthorizerEvent } from 'aws-lambda';

export const createTestEvent = (overrides: Partial<APIGatewayProxyWithCognitoAuthorizerEvent> = {}): APIGatewayProxyWithCognitoAuthorizerEvent => {
  const defaultEvent: APIGatewayProxyWithCognitoAuthorizerEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      accountId: '123456789012',
      apiId: 'api-id',
      authorizer: {
        claims: {
          sub: 'user-id-1'
        }
      },
      protocol: 'HTTP/1.1',
      httpMethod: 'GET',
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: null,
        userArn: null
      },
      path: '/',
      stage: 'test',
      requestId: 'request-id',
      requestTimeEpoch: 1234567890,
      resourceId: 'resource-id',
      resourcePath: '/',
      domainName: 'api.example.com',
      domainPrefix: 'api'
    },
    resource: ''
  };

  return {
    ...defaultEvent,
    ...overrides
  };
}; 