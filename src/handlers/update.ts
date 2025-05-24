import { APIGatewayProxyWithCognitoAuthorizerEvent, APIGatewayProxyResult } from 'aws-lambda';
import { client, addCorsHeaders } from '../common';
import { TodoItem } from '../types';

export const updateHandler = addCorsHeaders(async (event: APIGatewayProxyWithCognitoAuthorizerEvent): Promise<APIGatewayProxyResult> => {
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
  const {
    title,
    description,
    done
  } = JSON.parse(event.body || '{}');

  try {
    const { Items } = await client.query({
      TableName: 'todos',
      KeyConditionExpression: 'id = :id AND user_id = :user_id',
      ExpressionAttributeValues: {
        ':id': { S: id },
        ':user_id': { S: user_id }
      }
    }).promise();

    const originalItem = Items?.[0] as TodoItem;
    if (!originalItem) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found' })
      };
    }

    const item: TodoItem = {
      // id + user_id don't change
      id,
      user_id,
      // update or keep the title
      title: title || originalItem.title,
      // update or keep the desc
      description: description || originalItem.description,
      // update or keep the done
      done: done ?? originalItem.done,
      // keep the created at
      createdAt: originalItem.createdAt,
      // update the updated at
      updatedAt: new Date().toISOString()
    };

    // Put the new item.
    const resp = await client.put({
      TableName: 'todos',
      Item: item
    }).promise();

    // Return.
    return {
      statusCode: 200,
      body: JSON.stringify(resp)
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}); 