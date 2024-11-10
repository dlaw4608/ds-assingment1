import { marshall } from "@aws-sdk/util-dynamodb";
import { Book, BookPublisher } from "./types";

type Entity = Book | BookPublisher;
export const generateItem = (entity: Entity) => {
  return {
    PutRequest: {
      Item: marshall(entity),
    },
  };
};

export const generateBatch = (data: Entity[]) => {
  return data.map((e) => {
    return generateItem(e);
  });
};
