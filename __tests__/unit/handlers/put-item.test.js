// Import all functions from put-item.js 
const lambda = require('../../../src/handlers/add');
// Import dynamodb from aws-sdk 
const dynamodb = require('aws-sdk/clients/dynamodb');

// This includes all tests for putItemHandler() 
describe('Test putItemHandler', function () {
  let putSpy;

  // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
  beforeAll(() => {
    // Mock dynamodb get and put methods 
    // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
    putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
  });

  // Clean up mocks 
  afterAll(() => {
    putSpy.mockRestore();
  });

  // This test invokes putItemHandler() and compare the result  
  it('should add id to the table', async () => {
    const returnedItem = { title: 'new title', description: 'new description', done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

    // Return the specified value whenever the spied put function is called 
    putSpy.mockReturnValue({
      promise: () => Promise.resolve(returnedItem)
    });

    const event = {
      httpMethod: 'PUT',
      body: JSON.stringify({
        description: 'new description',
        title: 'new title',
        done: false
      }),
      requestContext: {
        authorizer: {
          claims: {
            sub: 'user-id-1'
          }
        }
      }
    };

    // Invoke putItemHandler() 
    const result = await lambda.putItemHandler(event);
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify('id1'),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
      }
    };


    // Compare the result with the expected result 
    expect(result.body.length).toBeGreaterThanOrEqual(36);
    expect(result.statusCode).toBe(expectedResult.statusCode);
    expect(result.headers).toStrictEqual(expectedResult.headers);
  });
});
