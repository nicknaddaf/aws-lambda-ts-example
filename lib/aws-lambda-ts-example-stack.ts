import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'node:path';

export class AwsLambdaTsExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const function01FunctionName = 'function-01';

		const function01 = new NodejsFunction(this, function01FunctionName, {
			functionName: function01FunctionName,
			runtime: Runtime.NODEJS_22_X,
			entry: path.join(
				__dirname,
				'/../lambda-functions/function01/index.ts'
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
