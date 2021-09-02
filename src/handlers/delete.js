const { client, addCorsHeaders } = require('../common');
/** @param {import('aws-lambda').APIGatewayProxyWithCognitoAuthorizerEvent} event */
exports.deleteHandler = addCorsHeaders(async event => {
  const {
    authorizer: {
      claims: {
        sub: user_id
      }
    }
  } = event.requestContext;

  const { id } = event.pathParameters;

  try {

    const response = await client.delete({
      TableName: 'todos',
      Key: {
        id,
        user_id
      }
    }).promise();

    return {
      statusCode: 201,
    };

  } catch(e) {
    console.error(e);
    return {
      statusCode: 500
    };
  }
});
