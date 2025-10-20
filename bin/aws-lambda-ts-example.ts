#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsLambdaTsExampleStack } from '../lib/aws-lambda-ts-example-stack';

const app = new cdk.App();

new AwsLambdaTsExampleStack(app, 'AwsLambdaTsExampleStack', {
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION,
	},
});
