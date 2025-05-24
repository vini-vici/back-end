import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
declare const client: DocumentClient;
export { client };
type HandlerFunction = (...args: any[]) => Promise<APIGatewayProxyResult>;
export declare const addCorsHeaders: (fn: HandlerFunction) => HandlerFunction;
