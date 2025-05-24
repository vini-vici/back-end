import { APIGatewayProxyResult, APIGatewayProxyWithCognitoAuthorizerEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { addCorsHeaders, client } from '../common';

export const putItemHandler = addCorsHeaders(async (event: APIGatewayProxyWithCognitoAuthorizerEvent): Promise<APIGatewayProxyResult> => {
  // All log statements are written to CloudWatch
  console.info('received:', event.body);
  console.info('claims', event.requestContext);

  // Get id and name from the body of the request
  const body = JSON.parse(event.body || '{}');
  const { title, description, done = false } = body;
  const id = uuidv4();
  const {
    authorizer: {
      claims: {
        sub: user_id
      }
    }
  } = event.requestContext;

  // Creates a new item, or replaces an old item with a new item
  const params = {
    TableName: 'todos',
    Item: {
      id: { S: id },
      title: { S: title },
      user_id: { S: user_id },
      description: { S: description },
      done: { BOOL: done },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    }
  };

  const result = await client.put(params).promise();
  console.info(result);
  
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(id)
  };

  // All log statements are written to CloudWatch
  console.info(`response from add: statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}); 