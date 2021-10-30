const { addCorsHeaders, client } = require('../common');

/** @param {import('aws-lambda').APIGatewayProxyWithCognitoAuthorizerEvent} event */
exports.updateFunction = addCorsHeaders(async event => {

  const {
    authorizers: {
      claims: {
        sub: user_id
      }
    }
  } = event.requestContext;
  const { id } = event.pathParameters;
  const {
    title,
    description,
    done
  } = JSON.parse(event.body || '{}');
  try {

    const { Items: [originalItem] } = await client.query({
      TableName: 'todos',
      KeyConditionExpression: 'id = :id AND user_id = :user_id',
      ExpressionAttributeValues: {
        ':id': id,
        ':user_id': user_id
      }
    }).promise();
  
    const item = {
      // id + user_id don't change
      id,
      user_id,
      // update or keep the title
      title: title || originalItem.title,
      // update or keep the desc
      description: description || originalItem.description,
      // update or keep the done
      done: done || true,
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
      statusCode: 500,
      body: JSON.stringify(resp)
    };
  } catch(e) {
    console.error(e);
  }

});