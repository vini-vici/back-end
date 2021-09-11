// Create clients and set shared const values outside of the handler.
const { v4 } = require('uuid');

const { client, addCorsHeaders } = require('../common');

/** @param {import('aws-lambda').APIGatewayProxyWithCognitoAuthorizerEvent} event */
exports.putItemHandler = addCorsHeaders(async event => {

  // All log statements are written to CloudWatch
  console.info('received:', event.body);
  console.info('claims', event.requestContext);

  // Get id and name from the body of the request
  const body = JSON.parse(event.body);
  const { title, description, done = false } = body;
  const id = v4();
  const {
    authorizer: {
      claims: {
        sub: user_id
      }
    }
  } = event.requestContext;

  // Creates a new item, or replaces an old item with a new item
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  var params = {
    TableName: 'todos',
    Item: {
      id: id,
      title: title,
      user_id: user_id,
      description: description,
      done: done,
      createdAt:new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  const result = await client.put(params).promise();
  const response = {
    statusCode: 200,
    body: JSON.stringify(id)
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
});
