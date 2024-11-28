import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log("[EVENT]", JSON.stringify(event));

   
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


    let updateExpression = "SET ";
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    if (body.title) {
      updateExpression += "#title = :title, ";
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = body.title;
    }
    if (body.author) {
      updateExpression += "#author = :author, ";
      expressionAttributeNames["#author"] = "author";
      expressionAttributeValues[":author"] = body.author;
    }
    if (body.synopsis) {
      updateExpression += "#synopsis = :synopsis, ";
      expressionAttributeNames["#synopsis"] = "synopsis";
      expressionAttributeValues[":synopsis"] = body.synopsis;
    }
    if (body.page_count !== undefined) {
      updateExpression += "#pageCount = :pageCount, ";
      expressionAttributeNames["#pageCount"] = "page_count";
      expressionAttributeValues[":pageCount"] = body.page_count;
    }
    if (body.popularity !== undefined) {
      updateExpression += "#popularity = :popularity, ";
      expressionAttributeNames["#popularity"] = "popularity";
      expressionAttributeValues[":popularity"] = body.popularity;
    }
    if (body.average_rating !== undefined) {
      updateExpression += "#averageRating = :averageRating, ";
      expressionAttributeNames["#averageRating"] = "average_rating";
      expressionAttributeValues[":averageRating"] = body.average_rating;
    }

  
    updateExpression = updateExpression.slice(0, -2);

   
    if (Object.keys(expressionAttributeValues).length === 0) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "No valid fields provided for update" }),
      };
    }

   
    const updateParams = {
      TableName: process.env.BOOKS_TABLE!,
      Key: { id: bookId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW" as const,
    };

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
