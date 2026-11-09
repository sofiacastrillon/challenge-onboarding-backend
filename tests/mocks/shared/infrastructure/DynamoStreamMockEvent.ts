import { v7 } from 'uuid';
import { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';

export type DynamoStreamEventName = 'INSERT' | 'MODIFY' | 'REMOVE';
export type StreamViewType =
  | 'NEW_AND_OLD_IMAGES'
  | 'KEYS_ONLY'
  | 'NEW_IMAGE'
  | 'OLD_IMAGE';

export interface DynamoStreamMockRecord {
  eventName: DynamoStreamEventName;
  dynamodb: {
    Keys: Record<string, any>;
    NewImage?: Record<string, any>;
    OldImage?: Record<string, any>;
  };
}

export const DynamoStreamMockEvent = ({
  records = [],
}: {
  records?: DynamoStreamMockRecord[];
}): DynamoDBStreamEvent => {
  if (!Array.isArray(records)) {
    throw new Error('records debe ser un array');
  }

  const dynamoRecords: DynamoDBRecord[] = records.map(
    (record: DynamoStreamMockRecord) => ({
      eventID: v7(),
      eventName: record.eventName as 'INSERT' | 'MODIFY' | 'REMOVE',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb: {
        ApproximateCreationDateTime: Math.floor(Date.now() / 1000),
        Keys: record.dynamodb.Keys,
        ...(record.dynamodb.NewImage && { NewImage: record.dynamodb.NewImage }),
        ...(record.dynamodb.OldImage && { OldImage: record.dynamodb.OldImage }),
        SequenceNumber: `${Date.now()}00000000000000000000`,
        SizeBytes: 100,
        StreamViewType: 'NEW_AND_OLD_IMAGES' as StreamViewType,
      },
    }),
  );

  return { Records: dynamoRecords };
};

export const createOutboxStreamEvent = (
  eventName: DynamoStreamEventName,
  outboxItem: any,
): DynamoDBStreamEvent => {
  const record: DynamoStreamMockRecord = {
    eventName,
    dynamodb: {
      Keys: {
        pk: { S: outboxItem.pk },
        sk: { S: outboxItem.sk },
      },
      ...(eventName !== 'REMOVE' && {
        NewImage: {
          pk: { S: outboxItem.pk },
          sk: { S: outboxItem.sk },
          id: { S: outboxItem.id },
          entityId: { S: outboxItem.entityId },
          entityType: { S: outboxItem.entityType },
          eventType: { S: outboxItem.eventType },
          payload: { S: JSON.stringify(outboxItem.payload) },
          status: { S: outboxItem.status },
          retries: { N: outboxItem.retries?.toString() || '0' },
          timestamp: {
            S: outboxItem.timestamp || Date.now().toString(),
          },
          idCompany: { S: outboxItem.idCompany },
        },
      }),
    },
  };

  return DynamoStreamMockEvent({ records: [record] });
};
