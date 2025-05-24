import { deleteHandler } from '../../../src/handlers/delete';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createTestEvent } from '../../helpers/test-utils';

describe('Test Delete Handler', () => {
  let scanSpy: jest.SpyInstance;

  beforeAll(() => {
    scanSpy = jest.spyOn(DocumentClient.prototype, 'delete');
  });

  afterAll(() => {
    scanSpy.mockRestore();
  });

  it('Should return correct headers and status', async () => {
    scanSpy.mockReturnValue({
      promise: () => Promise.resolve({})
    });

    const event = createTestEvent({
      httpMethod: 'DELETE',
      pathParameters: {
        id: 'id1'
      }
    });

    const result = await deleteHandler(event);

    const expectedResult = {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
      },
      body: JSON.stringify({ message: 'Item deleted successfully' })
    };

    expect(result).toStrictEqual(expectedResult);
  });
}); 