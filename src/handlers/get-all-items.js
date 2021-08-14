const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { NODE_ENV = 'development' } = process.env;
const ddbClient = new DynamoDBClient({
    endpoint: NODE_ENV === 'development' ? 'http://host.docker.internal:4000' : undefined,
    region: process.env.AWS_REGION || 'us-west-1'
});

const client = DynamoDBDocumentClient.from(ddbClient);
/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getAllItemsHandler = async event => {
    // Quick Debug.
    console.debug(JSON.stringify(event));
    // Scan the table for any new items.
    const { Items: items, LastEvaluatedKey, ScannedCount } = await client.send(new ScanCommand({TableName: 'sample'}));
    console.info(`Scanned ${ScannedCount} items. Last Evaluated Key: ${LastEvaluatedKey}`);
    return {
        statusCode: 200,
        body: JSON.stringify({
            items,
            next: LastEvaluatedKey
        })
    };
    
    // if (event.httpMethod !== 'GET') {
    //     throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    // }
    // // All log statements are written to CloudWatch
    // console.info('received:', event);

    // // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
    // // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    // // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
    // var params = {
    //     TableName : tableName
    // };
    // const data = await docClient.scan(params).promise();
    // const items = data.Items;

    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify(items)
    // };

    // // All log statements are written to CloudWatch
    // console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    // return response;
};
