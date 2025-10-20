exports.handler = async (event, context) => {
	console.log('Event:', JSON.stringify(event, null, 2));
	console.log('Context:', JSON.stringify(context, null, 2));

	try {
		const body = event.body ? JSON.parse(event.body) : {};
		const name = body.name || 'World';

		const currentTime = new Date().toISOString();

		// Simulate some async processing
		const processedData = await processRequest(name);

		const response = {
			message: `Hello ${processedData} from JavaScript Lambda!`,
			timestamp: currentTime,
			requestId: context.requestId,
			functionName: context.functionName,
			memoryLimit: context.memoryLimitInMB,
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
				error: error.message,
			}),
		};
	}
};

// Helper function to simulate async processing
async function processRequest(name) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(name.toUpperCase());
		}, 100);
	});
}
