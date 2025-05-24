import { putItemHandler } from '../../../src/handlers/add';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createTestEvent } from '../../helpers/test-utils';

describe('Test putItemHandler', () => {
  let putSpy: jest.SpyInstance;

  beforeAll(() => {
    putSpy = jest.spyOn(DocumentClient.prototype, 'put');
  });

  afterAll(() => {
    putSpy.mockRestore();
  });

  it('should add a new item', async () => {
    putSpy.mockReturnValue({
      promise: () => Promise.resolve({})
    });

    const event = createTestEvent({
      httpMethod: 'PUT',
      body: JSON.stringify({
        title: 'New todo',
        description: 'New description',
        done: false
      })
    });

    const result = await putItemHandler(event);

    const expectedResult = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
      }
    };

    expect(result.statusCode).toBe(expectedResult.statusCode);
    expect(result.headers).toStrictEqual(expectedResult.headers);
    expect(result.body).toBeDefined();
  });
}); 