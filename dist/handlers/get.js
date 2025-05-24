"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const common_1 = require("../common");
exports.getHandler = (0, common_1.addCorsHeaders)(async (event) => {
    var _a;
    const queryParams = {
        TableName: 'todos'
    };
    const { authorizer: { claims: { sub: user_id } } } = event.requestContext;
    if (event.pathParameters) {
        const { id } = event.pathParameters;
        console.info('grabbing event parameters', id);
        queryParams.ExpressionAttributeValues = {
            ':id': { S: id },
            ':user_id': { S: user_id }
        };
        console.info('Expression Attributes', queryParams);
        queryParams.KeyConditionExpression = 'id = :id AND user_id = :user_id';
        try {
            const result = await common_1.client.query(queryParams).promise();
            if (result.Items && result.Items.length > 1) {
                throw Error('Too many items returned');
            }
            return {
                statusCode: 200,
                body: JSON.stringify((_a = result.Items) === null || _a === void 0 ? void 0 : _a[0])
            };
        }
        catch (e) {
            console.error(e);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Internal server error' })
            };
        }
    }
    try {
        queryParams.ExpressionAttributeValues = {
            ':user_id': { S: user_id }
        };
        queryParams.FilterExpression = 'user_id = :user_id';
        const scannedItems = await common_1.client.scan(queryParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(scannedItems.Items)
        };
    }
    catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
});
//# sourceMappingURL=get.js.map