import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { HandlerFunction } from './types';

const { NODE_ENV = 'development', REGION = 'us-west-2' } = process.env;

const client = new DocumentClient({
  endpoint: NODE_ENV === 'development' ? 'http://host.docker.internal:4000' : undefined,
  region: REGION
});

export { client };

export const addCorsHeaders = <T>(fn: HandlerFunction<T>): HandlerFunction<T> => async (event: T) => {
  const response = await fn(event);
  response.headers = {
    ...response.headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
  };
  return response;
}; 