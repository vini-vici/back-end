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

describe('Test getByIdHandler', () => {
  let querySpy: jest.SpyInstance;

  beforeAll(() => {
    querySpy = jest.spyOn(DocumentClient.prototype, 'query');
  });

  afterAll(() => {
    querySpy.mockRestore();
  });

  it('should return a single item', async () => {
    const item: TodoItem = {
      id: 'id1',
      user_id: 'user-id-1',
      done: false,
      title: 'First todo',
      description: 'description 1'
    };

    querySpy.mockReturnValue({
      promise: () => Promise.resolve({ Items: [item] })
    });

    const event = createTestEvent({
      httpMethod: 'GET',
      pathParameters: {
        id: 'id1'
      }
    });

    const result = await getHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(item),
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