import { getHandler } from '../../../src/handlers/get';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createTestEvent } from '../../helpers/test-utils';

interface TodoItem {
  id: string;
  user_id: string;
  done: boolean;
  title: string;
  description: string;
}

describe('Test getAllItemsHandler', () => {
  let scanSpy: jest.SpyInstance;

  beforeAll(() => {
    scanSpy = jest.spyOn(DocumentClient.prototype, 'scan');
  });

  afterAll(() => {
    scanSpy.mockRestore();
  });

  it('should return items', async () => {
    const items: TodoItem[] = [
      { id: 'id1', user_id: 'user-id-1', done: false, title: 'First todo', description: 'description 1' },
      { id: 'id2', user_id: 'user-id-2', done: true, title: 'Second todo', description: 'description 2' }
    ];

    scanSpy.mockReturnValue({
      promise: () => Promise.resolve({ Items: items })
    });

    const event = createTestEvent({
      httpMethod: 'GET'
    });

    const result = await getHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
      }
    };

    expect(result.statusCode).toBe(expectedResult.statusCode);
    expect(result.body).toBe(expectedResult.body);
    expect(result.headers).toStrictEqual(expectedResult.headers);
  });
}); 