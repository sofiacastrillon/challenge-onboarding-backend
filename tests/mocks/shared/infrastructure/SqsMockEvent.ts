import { v7 } from 'uuid';
import { SQSEvent, SQSRecord } from 'aws-lambda';

export const SqsMockEvent = ({
  messages = [],
}: {
  messages?: any[];
}): SQSEvent => {
  if (!Array.isArray(messages)) {
    throw new Error('messages debe ser un array');
  }

  const records: SQSRecord[] = messages.map((message: any) => ({
    messageId: v7(),
    receiptHandle: 'MessageReceiptHandle',
    body: JSON.stringify(message),
    attributes: {
      ApproximateReceiveCount: '1',
      SentTimestamp: '1523232000000',
      SenderId: '123456789012',
      ApproximateFirstReceiveTimestamp: '1523232000001',
    },
    messageAttributes: {},
    md5OfBody: '{{{md5_of_body}}}',
    eventSource: 'aws:sqs',
    eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:MyQueue',
    awsRegion: 'us-east-1',
  }));

  return { Records: records };
};
