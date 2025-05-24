"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const common_1 = require("../common");
exports.updateHandler = (0, common_1.addCorsHeaders)(async (event) => {
    var _a;
    const { authorizer: { claims: { sub: user_id } } } = event.requestContext;
    if (!((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing id parameter' })
        };
    }
    const { id } = event.pathParameters;
    const { title, description, done } = JSON.parse(event.body || '{}');
    try {
        const { Items } = await common_1.client.query({
            TableName: 'todos',
            KeyConditionExpression: 'id = :id AND user_id = :user_id',
            ExpressionAttributeValues: {
                ':id': { S: id },
                ':user_id': { S: user_id }
            }
        }).promise();
        const originalItem = Items === null || Items === void 0 ? void 0 : Items[0];
        if (!originalItem) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Item not found' })
            };
        }
        const item = {
            // id + user_id don't change
            id,
            user_id,
            // update or keep the title
            title: title || originalItem.title,
            // update or keep the desc
            description: description || originalItem.description,
            // update or keep the done
            done: done !== null && done !== void 0 ? done : originalItem.done,
            // keep the created at
            createdAt: originalItem.createdAt,
            // update the updated at
            updatedAt: new Date().toISOString()
        };
        // Put the new item.
        const resp = await common_1.client.put({
            TableName: 'todos',
            Item: item
        }).promise();
        // Return.
        return {
            statusCode: 200,
            body: JSON.stringify(resp)
        };
    }
    catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
});
//# sourceMappingURL=update.js.map