import { APIGatewayProxyResult, APIGatewayProxyWithCognitoAuthorizerEvent } from 'aws-lambda';
import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { addCorsHeaders, client } from '../common';

export const getHandler = addCorsHeaders(async (event: APIGatewayProxyWithCognitoAuthorizerEvent): Promise<APIGatewayProxyResult> => {
  const queryParams: QueryInput = {
    TableName: 'todos'
  };

  const {
    authorizer: {
      claims: {
        sub: user_id
      }
    }
  } = event.requestContext;

  if (event.pathParameters) {
    const { id } = event.pathParameters;
    console.info('grabbing event parameters', id);

    queryParams.ExpressionAttributeValues = {
      ':id': { S: id },
      ':user_id': { S: user_id }
    };

    console.info('Expression Attributes', queryParams);

    queryParams.KeyConditionExpression = 'id = :id AND user_id = :user_id';

    try {
      const result = await client.query(queryParams).promise();
      if (result.Items && result.Items.length > 1) {
        throw Error('Too many items returned');
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(result.Items?.[0])
      };
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }

  try {
    queryParams.ExpressionAttributeValues = {
      ':user_id': { S: user_id }
    };
    queryParams.FilterExpression = 'user_id = :user_id';
    const scannedItems = await client.scan(queryParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(scannedItems.Items)
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}); 