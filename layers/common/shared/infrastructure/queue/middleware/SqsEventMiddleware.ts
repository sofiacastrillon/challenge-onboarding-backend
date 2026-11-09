import { SQSEvent, SQSRecord } from 'aws-lambda';
import { ZodSchema } from 'zod';
import QueueEvent from '../QueueEvent';
import BugTracker from '../../monitoring/BugTracker';

/**
 * Middleware for processing SQS events
 * @param schema Schema to validate the event data
 * @param handler Function to process the validated data
 */
export const SqsEventMiddleware = <T>(
  schema: ZodSchema | null,
  handler: (data: T) => Promise<any>,
) => {
  return async (event: SQSEvent) => {
    const failedMessageIds: { itemIdentifier: string }[] = [];

    console.log(JSON.stringify(event));

    const promises = event.Records.map(async (record: SQSRecord) => {
      try {
        const sqsEvent = new QueueEvent(record);
        const message = sqsEvent.getMessage();

        if (schema) {
          const validationResult = schema.safeParse(message);

          if (!validationResult.success) {
            const formattedErrors = validationResult.error.issues
              .map(issue => {
                const path = issue.path.join('.');
                return `${path ? path + ': ' : ''}${issue.message}`;
              })
              .join('; ');

            QueueEvent.registerOutput(
              400,
              `Event ${record.messageId} validation failed: ${formattedErrors}`,
            );
            failedMessageIds.push({ itemIdentifier: record.messageId });
            return;
          }

          await handler(validationResult.data as T);
        } else {
          await handler(message as T);
        }

        QueueEvent.registerOutput(
          200,
          `Event ${record.messageId} processed successfully`,
        );
      } catch (e: any) {
        BugTracker.captureException(e);
        QueueEvent.registerOutput(
          500,
          `Event ${record.messageId} processed with error`,
        );
        failedMessageIds.push({ itemIdentifier: record.messageId });
      }
    });

    await Promise.allSettled(promises);

    return {
      batchItemFailures: failedMessageIds,
    };
  };
};
