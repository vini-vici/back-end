"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = void 0;
const common_1 = require("../common");
exports.deleteHandler = (0, common_1.addCorsHeaders)(async (event) => {
    var _a;
    const { authorizer: { claims: { sub: user_id } } } = event.requestContext;
    if (!((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing id parameter' })
        };
    }
    const { id } = event.pathParameters;
    try {
        const response = await common_1.client.delete({
            TableName: 'todos',
            Key: {
                id: { S: id },
                user_id: { S: user_id }
            }
        }).promise();
        console.info(response.ItemCollectionMetrics, response.Attributes);
        return {
            statusCode: 202,
            body: JSON.stringify({ message: 'Item deleted successfully' })
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
//# sourceMappingURL=delete.js.map