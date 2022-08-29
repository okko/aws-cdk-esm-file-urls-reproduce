import { APIGatewayProxyEventV2, Context } from 'aws-lambda'
const handler = function (_event: APIGatewayProxyEventV2, _context: Context) {
  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: 'PONG',
  }
}

export { handler }
