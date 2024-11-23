/*import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import { generateBatch } from "../shared/util";
import { books, bookPublishers } from "../seed/books";

export interface RestAPIStackProps extends cdk.StackProps {
  userPoolId: string;
  userPoolClientId: string;
}

export class RestAPIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RestAPIStackProps) {
    super(scope, id, props);

    const { userPoolId, userPoolClientId } = props;

    // DynamoDB tables
    const booksTable = new dynamodb.Table(this, "BooksTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Books",
    });

    const bookPublisherTable = new dynamodb.Table(this, "BookPublisherTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "bookId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "publisherName", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "BookPublisher",
    });

    bookPublisherTable.addLocalSecondaryIndex({
      indexName: "countryIx",
      sortKey: { name: "country", type: dynamodb.AttributeType.STRING },
    });

    // Lambda functions
    const getBookByIdFn = new lambdanode.NodejsFunction(this, "GetBookByIdFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/getBookById.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: booksTable.tableName,
        REGION: 'eu-west-1',
      },
    });

    const getAllBooksFn = new lambdanode.NodejsFunction(this, "GetAllBooksFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/getAllBooks.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: booksTable.tableName,
        REGION: 'eu-west-1',
      },
    });

    const newBookFn = new lambdanode.NodejsFunction(this, "AddBookFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/addBooks.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: booksTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const updateBookFn = new lambdanode.NodejsFunction(this, "updateBooks", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/updateBooks.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: booksTable.tableName,
        REGION: 'eu-west-1',
      },
    });

    new AwsCustomResource(this, "booksddbInitData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [booksTable.tableName]: generateBatch(books),
            [bookPublisherTable.tableName]: generateBatch(bookPublishers),
          },
        },
        physicalResourceId: PhysicalResourceId.of("booksddbInitData"),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [booksTable.tableArn, bookPublisherTable.tableArn],
      }),
    });

    const getBookPublisherFn = new lambdanode.NodejsFunction(this, "GetBookPublisherFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/getBookPublisher.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: bookPublisherTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const authorizerFn = new lambdanode.NodejsFunction(this, "AuthorizerFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: "./lambdas/auth/authorizer.ts",
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        USER_POOL_ID: userPoolId,
        CLIENT_ID: userPoolClientId,
        REGION: cdk.Aws.REGION,
      },
    });

    const requestAuthorizer = new apig.RequestAuthorizer(this, "RequestAuthorizer", {
      identitySources: [apig.IdentitySource.header("Authorization")],
      handler: authorizerFn,
      resultsCacheTtl: cdk.Duration.minutes(5),
    });

    // API Gateway
    const api = new apig.RestApi(this, "RestAPI", {
      description: "demo API with Authorization",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const booksEndpoint = api.root.addResource("books");
    booksEndpoint.addMethod("GET", new apig.LambdaIntegration(getAllBooksFn, { proxy: true }));
    booksEndpoint.addMethod("POST", new apig.LambdaIntegration(newBookFn, { proxy: true }), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    const bookEndpoint = booksEndpoint.addResource("{bookId}");
    bookEndpoint.addMethod("GET", new apig.LambdaIntegration(getBookByIdFn, { proxy: true }));
    bookEndpoint.addMethod("PUT", new apig.LambdaIntegration(updateBookFn, { proxy: true }), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    const bookPublishersEndpoint = booksEndpoint.addResource("publisher");
    bookPublishersEndpoint.addMethod("GET", new apig.LambdaIntegration(getBookPublisherFn, { proxy: true }), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });
  }
}*/