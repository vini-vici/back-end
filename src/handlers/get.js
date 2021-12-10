const { client, addCorsHeaders } = require('../common');

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 * @param {import('aws-lambda').APIGatewayProxyWithCognitoAuthorizerEvent} event
 */
exports.getHandler = addCorsHeaders(async event => {
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
    console.info('grabbing event parameters', id);

    queryParams.ExpressionAttributeValues = {
      ':id': id,
      ':user_id': user_id
    };

    console.info('Expression Attributes', queryParams);

    queryParams.KeyConditionExpression = 'id = :id AND user_id = :user_id';

    try {
      const j = await client.query(queryParams).promise();
      if(j.Items.length > 1) 
        throw Error('Too many items returned');
      
      return {
        statusCode: 200,
        body: JSON.stringify(j.Items[0])
      };
    } catch(e) {
      console.error(e);
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
      statusCode: 500,
      body: 'bad'
    };
  }
});
