const {deleteHandler} = require('../../../src/handlers/delete');

const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test Delete Handler', () => {
  let scanSpy;
  beforeAll(() => {
    scanSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'delete');
  });
  afterAll(() => {
    scanSpy.mockRestore();
  });
  it('Should return correct headers and status', async () => {
    scanSpy.mockReturnValue({
      promise: () => Promise.resolve({})
    });
    const event = {
      httpMethod: 'DELETE',
      pathParameters: {
        id: 'id1'
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: 'user-id-1'
          }
        }
      }
    };

    const result = await deleteHandler(event);

    const expectedResult = {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
      }
    };

    expect(result).toStrictEqual(expectedResult);
  });
});