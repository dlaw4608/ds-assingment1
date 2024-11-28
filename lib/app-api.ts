import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as node from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export interface AppApiProps extends cdk.StackProps {
  userPoolId: string;
  userPoolClientId: string;
  booksTable: dynamodb.Table;
  bookPublisherTable: dynamodb.Table;
}

export class AppApi extends Construct {
  constructor(scope: Construct, id: string, props: AppApiProps) {
    super(scope, id);

    // Create API Gateway
    const appApi = new apig.RestApi(this, "AppApi", {
      description: "Book Database App RestApi",
      endpointTypes: [apig.EndpointType.REGIONAL],
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: apig.Cors.ALL_ORIGINS,
      },
    });

    // Common function properties
    const appCommonFnProps = {
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      environment: {
        BOOKS_TABLE: props.booksTable.tableName,
        BOOKS_PUBLISHERS_TABLE: props.bookPublisherTable.tableName,
        USER_POOL_ID: props.userPoolId,
        CLIENT_ID: props.userPoolClientId,
        REGION: cdk.Aws.REGION,
      },
    };

   
   
    // Authorizer function
    const authorizerFn = new node.NodejsFunction(this, "AuthorizerFn", {
      ...appCommonFnProps,
      entry: "./lambdas/auth/authorizer.ts",
    });

    const requestAuthorizer = new apig.RequestAuthorizer(this, "RequestAuthorizer", {
      identitySources: [apig.IdentitySource.header("Authorization")],
      handler: authorizerFn,
      resultsCacheTtl: cdk.Duration.minutes(5),
    });

    // Lambda functions for book-related operations
    const getBookByIdFn = new node.NodejsFunction(this, "GetBookByIdFn", {
      ...appCommonFnProps,
      entry: "./lambdas/getBookById.ts",
    });

    const booksEndpoint = appApi.root.addResource("books");
    const getAllBooksFn = new node.NodejsFunction(this, "GetAllBooksFn", {
      ...appCommonFnProps,
      entry: "./lambdas/getAllBooks.ts",
    });

    const newBookFn = new node.NodejsFunction(this, "AddBookFn", {
      ...appCommonFnProps,
      entry: "./lambdas/addBooks.ts",
    });

    const updateBookFn = new node.NodejsFunction(this, "UpdateBookFn", {
      ...appCommonFnProps,
      entry: "./lambdas/updateBooks.ts",
    });

    const getBookPublisherFn = new node.NodejsFunction(this, "GetBookPublisherFn", {
      ...appCommonFnProps,
      entry: "./lambdas/getBookPublisher.ts",
    });

    // API Endpoints
    booksEndpoint.addMethod("GET", new apig.LambdaIntegration(getAllBooksFn));
    booksEndpoint.addMethod("POST", new apig.LambdaIntegration(newBookFn), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    const bookByIdEndpoint = booksEndpoint.addResource("{bookId}");
    bookByIdEndpoint.addMethod("GET", new apig.LambdaIntegration(getBookByIdFn));
    bookByIdEndpoint.addMethod("PUT", new apig.LambdaIntegration(updateBookFn), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    const bookPublishersEndpoint = booksEndpoint.addResource("publisher");
    bookPublishersEndpoint.addMethod("GET", new apig.LambdaIntegration(getBookPublisherFn), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    // Grant permissions
    props.booksTable.grantReadData(getAllBooksFn);
    props.booksTable.grantReadData(getBookByIdFn);
    props.booksTable.grantReadWriteData(updateBookFn);
    props.booksTable.grantReadWriteData(newBookFn);
    props.bookPublisherTable.grantReadWriteData(getBookPublisherFn);
   
    // Public and Protected Endpoints
    const protectedRes = appApi.root.addResource("protected");
    const publicRes = appApi.root.addResource("public");

    const protectedFn = new node.NodejsFunction(this, "ProtectedFn", {
      ...appCommonFnProps,
      entry: "./lambdas/auth/protected.ts",
    });

    const publicFn = new node.NodejsFunction(this, "PublicFn", {
      ...appCommonFnProps,
      entry: "./lambdas/auth/public.ts",
    });

    protectedRes.addMethod("GET", new apig.LambdaIntegration(protectedFn), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    publicRes.addMethod("GET", new apig.LambdaIntegration(publicFn));
  }
}