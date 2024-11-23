import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { AuthApi } from "./auth-api";
import {books, bookPublishers} from "../seed/books";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { generateBatch } from "../shared/util";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { AppApi } from "./app-api";

export class AuthAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    const userPool = new UserPool(this, "UserPool", {
      signInAliases: { username: true, email: true },
      selfSignUpEnabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolId = userPool.userPoolId;

    const appClient = userPool.addClient("AppClient", {
      authFlows: { userPassword: true },
    });

    const userPoolClientId = appClient.userPoolClientId;

    new AuthApi(this, "AuthServiceApi", {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
    });

    new AppApi(this, "AppApi", {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      env: { region: "eu-west-1" },
      booksTable: booksTable,
      bookPublisherTable: bookPublisherTable,
    });


    
  }
}