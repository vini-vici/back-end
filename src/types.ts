// Centralized types for the backend

import { APIGatewayProxyResult } from 'aws-lambda';

export interface TodoItem {
  id: string;
  title: string;
  user_id: string;
  description: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HandlerFunction<T = unknown> = (event: T) => Promise<APIGatewayProxyResult>; 