import { APIGatewayProxyWithCognitoAuthorizerEvent, APIGatewayProxyResult } from 'aws-lambda';
import { client, addCorsHeaders } from '../common';

export const deleteHandler = addCorsHeaders(async (event: APIGatewayProxyWithCognitoAuthorizerEvent): Promise<APIGatewayProxyResult> => {
  const {
    authorizer: {
      claims: {
        sub: user_id
      }
    }
  } = event.requestContext;

  if (!event.pathParameters?.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id parameter' })
    };
  }

  const { id } = event.pathParameters;

  try {
    const response = await client.delete({
      TableName: 'todos',
      Key: {
        id: { S: id },
        user_id: { S: user_id }
      }
    }).promise();

    console.info(response.ItemCollectionMetrics, response.Attributes);

    return {
      statusCode: 202,
      body: JSON.stringify({ message: 'Item deleted successfully' })
    };

  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}); 