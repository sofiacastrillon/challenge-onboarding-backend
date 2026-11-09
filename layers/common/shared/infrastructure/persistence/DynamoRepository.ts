import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  TransactWriteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const MAX_ITEMS_TRANSACTION = 100;

export interface IDynamoKey {
  pk: string;
  sk: string;
}

export const DynamoOperation = {
  PUT: 'Put',
  DELETE: 'Delete',
} as const;

export type DynamoOperation =
  (typeof DynamoOperation)[keyof typeof DynamoOperation];

export abstract class DynamoRepository {
  protected db: DynamoDBDocumentClient;
  protected tableName: string;

  constructor(tableName: string, region: string = 'us-east-1') {
    const client = new DynamoDBClient({
      region,
    });
    this.db = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async saveItem(item: any, isNew: boolean = false): Promise<any> {
    const currentTimestamp = new Date().toISOString();
    const itemToSave = { ...item };

    itemToSave.updatedAt = currentTimestamp;
    if (isNew) itemToSave.createdAt = currentTimestamp;

    await this.db.send(
      new PutCommand({
        TableName: this.tableName,
        Item: itemToSave,
      }),
    );

    return itemToSave;
  }

  async saveTransaction(items: any[], isNew: boolean = false): Promise<any> {
    if (items.length > MAX_ITEMS_TRANSACTION) {
      throw new Error(
        `Write Error: Dynamo only allows ${MAX_ITEMS_TRANSACTION} items per transaction`,
      );
    }

    const transactItems = items.map(item => {
      const currentTimestamp = new Date().toISOString();
      const itemToSave = { ...item };

      itemToSave.updatedAt = currentTimestamp;
      if (isNew) itemToSave.createdAt = currentTimestamp;

      return {
        Put: {
          TableName: this.tableName,
          Item: itemToSave,
        },
      };
    });

    return this.db.send(
      new TransactWriteCommand({
        TransactItems: transactItems,
      }),
    );
  }

  async deleteTransaction(keys: any[]): Promise<any> {
    if (keys.length > MAX_ITEMS_TRANSACTION) {
      throw new Error(
        `Write Error: Dynamo only allows ${MAX_ITEMS_TRANSACTION} items per transaction`,
      );
    }

    return this.db.send(
      new TransactWriteCommand({
        TransactItems: keys.map(Key => ({
          Delete: {
            TableName: this.tableName,
            Key,
          },
        })),
      }),
    );
  }

  deleteItem(key: any): Promise<any> {
    return this.db.send(
      new DeleteCommand({ TableName: this.tableName, Key: key }),
    );
  }

  getItem(key: any): Promise<any> {
    return this.db.send(
      new GetCommand({ TableName: this.tableName, Key: key }),
    );
  }

  scan(params: any): Promise<any> {
    return this.db.send(new ScanCommand(params));
  }

  query(params: any): Promise<any> {
    return this.db.send(new QueryCommand(params));
  }

  encodeLastKey(lastKey: object) {
    return Buffer.from(JSON.stringify(lastKey)).toString('base64');
  }

  decodeLastKey(lastKey: string) {
    return JSON.parse(Buffer.from(lastKey, 'base64').toString());
  }

  async saveTransactionCrossTable(
    items: Array<{
      tableName: string;
      item: any;
      operation: DynamoOperation;
      isNew?: boolean;
    }>,
  ): Promise<any> {
    if (items.length > MAX_ITEMS_TRANSACTION) {
      throw new Error(
        `Write Error: Dynamo only allows ${MAX_ITEMS_TRANSACTION} items per transaction`,
      );
    }

    const transactItems = items.map(
      ({ tableName, item, operation, isNew = false }) => {
        if (operation === DynamoOperation.DELETE) {
          return {
            Delete: {
              TableName: tableName,
              Key: item,
            },
          };
        }

        const currentTimestamp = new Date().toISOString();
        const itemToSave = { ...item };

        itemToSave.updatedAt = currentTimestamp;
        if (isNew) itemToSave.createdAt = currentTimestamp;

        return {
          Put: {
            TableName: tableName,
            Item: itemToSave,
          },
        };
      },
    );

    return this.db.send(
      new TransactWriteCommand({
        TransactItems: transactItems,
      }),
    );
  }
}
