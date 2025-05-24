"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorsHeaders = exports.client = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const { NODE_ENV = 'development', REGION = 'us-west-2' } = process.env;
const client = new dynamodb_1.DocumentClient({
    endpoint: NODE_ENV === 'development' ? 'http://host.docker.internal:4000' : undefined,
    region: REGION
});
exports.client = client;
const addCorsHeaders = (fn) => async (...args) => {
    const response = await fn(...args);
    response.headers = {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST'
    };
    return response;
};
exports.addCorsHeaders = addCorsHeaders;
//# sourceMappingURL=common.js.map