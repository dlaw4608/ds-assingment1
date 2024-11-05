import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log("[EVENT]", JSON.stringify(event));

    // Extract bookId from path parameters
    const parameters = event?.pathParameters;
    const bookId = parameters?.bookId ? parseInt(parameters.bookId) : undefined;

    if (!bookId) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing or invalid book ID" }),
      };
    }

    // Parse the request body
    const body = event.body ? JSON.parse(event.body) : undefined;
    if (!body) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    // Construct the UpdateCommand parameters (No type annotation needed)
    const updateParams = {
      TableName: process.env.TABLE_NAME!,
      Key: { id: bookId }, // Use bookId as the partition key
      UpdateExpression: `
        SET #title = :title,
            #author = :author,
            #synopsis = :synopsis,
            #pageCount = :pageCount,
            #popularity = :popularity
      `,
      ExpressionAttributeNames: {
        "#title": "title",
        "#author": "author",
        "#synopsis": "synopsis",
        "#pageCount": "page_count",
        "#popularity": "popularity",
      },
      ExpressionAttributeValues: {
        ":title": body.title,
        ":author": body.author,
        ":synopsis": body.synopsis,
        ":pageCount": body.page_count,
        ":popularity": body.popularity,
      },
      ReturnValues: "UPDATED_NEW", // Use string directly
    };

    // Execute the UpdateCommand
    const commandOutput = await ddbDocClient.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: "Book updated successfully",
        updatedAttributes: commandOutput.Attributes,
      }),
    };
  } catch (error: any) {
    console.error(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
