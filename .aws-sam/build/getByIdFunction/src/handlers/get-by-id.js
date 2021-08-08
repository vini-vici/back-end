const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { QueryCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: 'us-west-1',
  endpoint: 'http://host.docker.internal:4000'
}));

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.getByIdHandler = async event => {
  if (event.httpMethod !== 'GET')
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);

  // All log statements are written to CloudWatch
  console.info('received:', event);

  const params = {
    KeyConditionExpression: '#id = :s ',
    ExpressionAttributeNames: {
      '#id': 'id'
    },
    ExpressionAttributeValues: {
      ':s': { S: '1' }
    },
    ProjectionExpression: 'id',
    TableName: 'sample',
  };
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  const { id } = event.pathParameters;
  console.log(`ID: ${id}`);

  const data = await client.send(new QueryCommand(params));

  const { Items: item } = data;

  const response = {
    statusCode: 200,
    body: JSON.stringify(item)
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
