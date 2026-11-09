import { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { ZodSchema } from 'zod';
import DynamoStreamEvent from '../DynamoStreamEvent';
import BugTracker from '../../monitoring/BugTracker';

/**
 * Middleware for processing DynamoDB Stream events
 * @param schema Schema to validate the event data
 * @param handler Function to process the validated data
 */
export const DynamoStreamMiddleware = <T>(
  schema: ZodSchema | null,
  handler: (
    data: T,
    eventName: string,
    streamEvent: DynamoStreamEvent,
  ) => Promise<any>,
) => {
  return async (event: DynamoDBStreamEvent) => {
    const failedMessageIds: { itemIdentifier: string }[] = [];

    console.log(JSON.stringify(event));

    const promises = event.Records.map(async (record: DynamoDBRecord) => {
      try {
        const streamEvent = new DynamoStreamEvent(record);
        const data = streamEvent.getData();
        const eventName = streamEvent.getEventName();

        if (schema) {
          const validationResult = schema.safeParse(data);

          if (!validationResult.success) {
            const formattedErrors = validationResult.error.issues
              .map(issue => {
                const path = issue.path.join('.');
                return `${path ? path + ': ' : ''}${issue.message}`;
              })
              .join('; ');

            console.error('Validation error:', formattedErrors);
            failedMessageIds.push({
              itemIdentifier:
                record.dynamodb?.SequenceNumber || record.eventID || 'unknown',
            });
            return;
          }

          await handler(validationResult.data as T, eventName, streamEvent);
        } else {
          await handler(data as T, eventName, streamEvent);
        }

        DynamoStreamEvent.registerOutput(
          200,
          'Stream event processed successfully',
        );
      } catch (e: any) {
        BugTracker.captureException(e);
        failedMessageIds.push({
          itemIdentifier:
            record.dynamodb?.SequenceNumber || record.eventID || 'unknown',
        });
      }
    });

    await Promise.allSettled(promises);

    return {
      batchItemFailures: failedMessageIds,
    };
  };
};
