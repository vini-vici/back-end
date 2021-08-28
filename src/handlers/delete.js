/** @param {import('aws-lambda').APIGatewayProxyEventV2} event */
exports.deleteHandler = async event => {
  console.log(event.requestContext.authorizer);
  return {
    statusCode: 200
  };
};
