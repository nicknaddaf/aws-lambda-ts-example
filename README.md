# AWS Lambda Function with TypeScript Example

This repo contains a complete guide to explain how to create AWS CDK project with TypeScript Lambda functions.

I'll walk you through creating a complete AWS CDK project that can deploy Lambda functions written in both JavaScript and TypeScript.

## Prerequisites

Before starting, ensure you have:

-   Node.js (v18 or later) installed
-   AWS CLI configured with your credentials
-   AWS CDK CLI installed globally
-   AWS SAM CLI
-   Docker Desktop (for SAM when test locally)

```bash
npm install -g aws-cdk
```

## Initialize the CDK Project

Create a new directory and initialize the CDK project:

```bash
cdk init app --language typescript
```

This creates a CDK project with the following structure:

-   bin/ - Entry point for the CDK app
-   lib/ - Where you define your infrastructure stacks
-   test/ - Unit tests
-   cdk.json - CDK configuration

## Project Structure

Create a new folder in the root of the CDK project to place all the Lambda functions

```bash
mkdir lambda-functions
```

Your project structure should look like:

```
my-cdk-lambda-project/
├── bin/
├── lib/
├── lambda-functions/
│ ├── function01/
│ └── function01/
├── node_modules/
├── package.json
└── cdk.json
```

## Create Sample Lambda Function with TypeScript

```bash
mkdir lambda-functions/function01

cd lambda-functions/function01

npm init -y

npm install --save-dev @types/aws-lambda @types/node
```

Add a tsconfig.json to this folder

```json
{
	"compilerOptions": {
		"target": "es2020",
		"strict": true,
		"preserveConstEnums": true,
		"noEmit": true,
		"sourceMap": false,
		"module": "commonjs",
		"moduleResolution": "node",
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
		"isolatedModules": true
	},
	"exclude": ["node_modules", "**/*.test.ts"]
}
```

Create a index.ts file and paste the following code in it:

```TypeScript
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

```

## Define the CDK Stack

Add the following code to your stack's constructor:

```TypeScript
const function01FunctionName = 'function-01';

const function01 = new NodejsFunction(this, function01FunctionName, {
    functionName: function01FunctionName,
    runtime: Runtime.NODEJS_22_X,
    entry: path.join(
        __dirname,
        '../lambda-functions/function01-ts/index.ts'
    ),
    handler: 'handler',
    timeout: cdk.Duration.seconds(30),
    memorySize: 128,
    environment: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
    },
    bundling: {
        minify: true,
        sourceMap: true,
        target: 'es2020',
        externalModules: [
            'aws-sdk', // Exclude aws-sdk as it's available in Lambda runtime
        ],
    },
});

// Output the Lambda function names
new cdk.CfnOutput(this, 'function01-output', {
    value: function01.functionName,
    description: 'Name of the Lambda function #1',
});
```

Your stack should look like this:

```TypeScript
export class AwsLambdaTsExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const function01FunctionName = 'function-01';

		const function01 = new NodejsFunction(this, function01FunctionName, {
			functionName: function01FunctionName,
			runtime: Runtime.NODEJS_22_X,
			entry: path.join(
				__dirname,
				'../lambda-functions/function01-ts/index.ts'
			),
			handler: 'handler',
			timeout: cdk.Duration.seconds(30),
			memorySize: 128,
			environment: {
				NODE_ENV: 'production',
				LOG_LEVEL: 'info',
			},
			bundling: {
				minify: true,
				sourceMap: true,
				target: 'es2020',
				externalModules: [
					'aws-sdk', // Exclude aws-sdk as it's available in Lambda runtime
				],
			},
		});

		// Output the Lambda function names
		new cdk.CfnOutput(this, 'function01-output', {
			value: function01.functionName,
			description: 'Name of the Lambda function #1',
		});
	}
}
```

## Understanding the Key Components

NodejsFunction vs Function Construct

### NodejsFunction (for TypeScript):

-   Automatically bundles and transpiles TypeScript code using esbuild
-   Handles dependencies and tree-shaking
-   Minifies code for smaller deployment packages
-   Generates source maps for debugging

### Function (for JavaScript):

-   Uses code as-is from the specified directory
-   No bundling or transpilation
-   Simpler for plain JavaScript files

### Important Configuration Options

-   runtime: The Node.js version (use NODEJS_20_X for latest)
-   timeout: Maximum execution time (default 3 seconds, max 15 minutes)
-   memorySize: RAM allocation (128 MB to 10,240 MB)
-   environment: Environment variables accessible in your Lambda code

## Testing AWS CDK Lambda Functions Locally with AWS SAM

AWS SAM (Serverless Application Model) CLI can be used to test Lambda functions deployed via CDK locally.
Here's a complete guide:

### Synthesize CloudFormation Template

CDK projects need to be synthesized into CloudFormation templates that SAM can understand:
(This command should be executed in the root directory of the project)

```bash
cdk synth --no-staging > template.yaml
```

### Create Test Event Files

Create a directory for test events:

```bash
mkdir -p events
```

Create test event files for your Lambda functions:

event/test-event-01.json

```json
{
	"body": "{\"name\": \"Local Test User\"}",
	"headers": {
		"Content-Type": "application/json"
	},
	"httpMethod": "POST",
	"isBase64Encoded": false,
	"path": "/test",
	"queryStringParameters": null,
	"requestContext": {
		"accountId": "123456789012",
		"apiId": "test-api",
		"requestId": "test-request-id",
		"requestTime": "09/Apr/2015:12:34:56 +0000",
		"requestTimeEpoch": 1428582896000
	}
}
```

### Test Lambda Functions Locally

```bash
sam local invoke -t template.yaml -e events/test-event-01.json function-01
```

### Generate Sample Event with SAM CLI

The AWS SAM CLI provides a command to generate sample event payloads for various AWS services. These generated events can then be used for local testing of Lambda functions.

The basic syntax is:

```bash
sam local generate-event <service> <event-type> [OPTIONS]
```

Generate S3 event sends to local Lambda function:

```bash
sam local generate-event s3 put

sam local generate-event s3 delete
```

To generate a sample event for an API Gateway request using the AWS Proxy integration, specifically for a GET method:

```bash
sam local generate-event apigateway aws-proxy --method GET
```
