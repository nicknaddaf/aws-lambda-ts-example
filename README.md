# AWS Lambda Function with TypeScript Example

This repo contains a production-ready AWS Lambda function example with TypeScript that demonstrate best practices for efficiency, security, and maintainability.

## Setrup CDK Project

We will create a CDK project, to create an AWS CDK application using TypeScript, follow these steps:
Prerequisites:

-   Ensure Node.js and npm are installed.
-   Configure the AWS CLI with access to your AWS account.
-   Install the AWS CDK globally:

```bash
npm install -g aws-cdk
```

Initialize a new CDK app with TypeScript:

```bash
cdk init app --language typescript
```

## Prepare the Structure for Lambda Functions

Create a new folder in the root of the CDK project to place all the Lambda functions

```bash
mkdir lambda-functions
```
