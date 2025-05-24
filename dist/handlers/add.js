"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putItemHandler = void 0;
const uuid_1 = require("uuid");
const common_1 = require("../common");
exports.putItemHandler = (0, common_1.addCorsHeaders)(async (event) => {
    // All log statements are written to CloudWatch
    console.info('received:', event.body);
    console.info('claims', event.requestContext);
    // Get id and name from the body of the request
    const body = JSON.parse(event.body || '{}');
    const { title, description, done = false } = body;
    const id = (0, uuid_1.v4)();
    const { authorizer: { claims: { sub: user_id } } } = event.requestContext;
    // Creates a new item, or replaces an old item with a new item
    const params = {
        TableName: 'todos',
        Item: {
            id: { S: id },
            title: { S: title },
            user_id: { S: user_id },
            description: { S: description },
            done: { BOOL: done },
            createdAt: { S: new Date().toISOString() },
            updatedAt: { S: new Date().toISOString() }
        }
    };
    const result = await common_1.client.put(params).promise();
    console.info(result);
    const response = {
        statusCode: 200,
        body: JSON.stringify(id)
    };
    // All log statements are written to CloudWatch
    console.info(`response from add: statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
});
//# sourceMappingURL=add.js.map