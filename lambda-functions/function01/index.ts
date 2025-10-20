import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from 'aws-lambda';

interface RequestBody {
	name?: string;
}

export const handler = async (
	event: APIGatewayProxyEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	console.log('Event:', JSON.stringify(event, null, 2));
	console.log('Context:', JSON.stringify(context, null, 2));

	try {
		const body: RequestBody = event.body ? JSON.parse(event.body) : {};
		const name = body.name || 'World';

		const currentTime = new Date().toISOString();

		const response = {
			message: `Hello ${name} from TypeScript Lambda!`,
			timestamp: currentTime,
			requestId: context.awsRequestId,
			functionName: context.functionName,
		};

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify(response),
		};
	} catch (error) {
		console.error('Error:', error);

		return {
			statusCode: 500,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: 'Internal server error',
				error: error instanceof Error ? error.message : 'Unknown error',
			}),
		};
	}
};
