// Import all functions from get-all-items.js 
const lambda = require('../../../src/handlers/get');
// Import dynamodb from aws-sdk 
const dynamodb = require('aws-sdk/clients/dynamodb');

// This includes all tests for getAllItemsHandler() 
describe('Test getAllItemsHandler', () => {
  let scanSpy;

  // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
  beforeAll(() => {
    // Mock dynamodb get and put methods 
    // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
    scanSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
  });

  // Clean up mocks 
  afterAll(() => {
    scanSpy.mockRestore();
  });

  it('should return items', async () => {
    const items = [
      { id: 'id1', user_id: 'user-id-1', done: false, title: 'First todo', description: 'description 1' },
      { id: 'id2', user_id: 'user-id-2', done: true, title: 'Second todo', description: 'description 2' }];

    // Return the specified value whenever the spied scan function is called 
    scanSpy.mockReturnValue({
      promise: () => Promise.resolve({ Items: items })
    });

    const event = {
      httpMethod: 'GET',
      requestContext: {
        authorizer: {
          claims: {
            sub: 'user-id-1'
          }
        }
      }
    };

    // Invoke helloFromLambdaHandler() 
    const result = await lambda.getHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
      }
    };

    // Compare the result with the expected result 
    expect(result.statusCode).toBe(expectedResult.statusCode);
    // Make sure the body matches
    expect(result.body).toBe(expectedResult.body);
    // Make sure the headers are the same.
    expect(result.headers).toStrictEqual(expectedResult.headers);
  });
}); 
