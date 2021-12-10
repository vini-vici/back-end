// Import all functions from get-by-id.js 
const lambda = require('../../../src/handlers/get');
// Import dynamodb from aws-sdk 
const dynamodb = require('aws-sdk/clients/dynamodb');

// This includes all tests for getByIdHandler() 
describe('Test getByIdHandler', () => {

  let getSpy;

  // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
  beforeAll(() => {
    // Mock dynamodb get and put methods 
    // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
    getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
  });

  // Clean up mocks 
  afterAll(() => {
    getSpy.mockRestore();
  });

  // This test invokes getByIdHandler() and compare the result  
  it('should get item by id', async () => {
    const item = { id: 'id1', user_id: 'user-id-1', done: false, title: 'first todo', description: 'description 1' };

    // Return the specified value whenever the spied get function is called 
    getSpy.mockReturnValue({
      promise: () => Promise.resolve({ Items: [item] })
    });

    const event = {
      httpMethod: 'GET',
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

    // Invoke getByIdHandler() 
    const result = await lambda.getHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(item),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
      }
    };

    // Compare the result with the expected result 
    expect(result).toStrictEqual(expectedResult);
  });
});