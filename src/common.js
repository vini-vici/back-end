const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const { NODE_ENV = 'development', REGION = 'us-west-2' } = process.env;
const client = new DocumentClient({
  endpoint: NODE_ENV === 'development' ? 'http://host.docker.internal:4000' : undefined,
  region: REGION
});
exports.client = client;
exports.addCorsHeaders =  fn => async (...args) => {
    const response = await fn(...args);
    response.headers = {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
    };
    return response;
  };