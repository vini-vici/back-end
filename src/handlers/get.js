const { client } = require('../common');
/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 * @param {import('aws-lambda').APIGatewayProxyWithCognitoAuthorizerEvent} event
 */
exports.getHandler = async event => {
  /** @type {import('aws-sdk/clients/dynamodb').QueryInput} */
  const queryParams = {
    TableName: 'todos'
  };

  const {
    authorizer: {
      claims: {
        sub: user_id
      }
    }
  } = event.requestContext;

  if(event.pathParameters) {
    const { id } = event.pathParameters;

    queryParams.ExpressionAttributeNames = {
      '#id': 'id'
    };

    queryParams.ExpressionAttributeValues = {
      ':id': id,
      ':user_id': user_id
    };

    queryParams.KeyConditionExpression = '#id = :id AND user_id = :user_id';

    queryParams.KeyConditionExpression = '';

    try {
      const j = await client.scan(queryParams).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(j)
      };
    } catch(e) {
      console.log(e);
      return {
        statusCode: 500,
      };
    }
  }

  try {
    queryParams.ExpressionAttributeValues = {
      ':user_id': user_id
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
      statusCode: 500
    };
  }
};
