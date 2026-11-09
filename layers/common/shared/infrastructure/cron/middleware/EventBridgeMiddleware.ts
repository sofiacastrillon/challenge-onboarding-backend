import { EventBridgeEvent } from 'aws-lambda';
import { ZodSchema } from 'zod';
import BugTracker from '../../monitoring/BugTracker';

/**
 * Middleware for processing EventBridge events
 * @param schema Schema to validate the event data
 * @param handler Function to process the validated data
 */
export const EventBridgeMiddleware = <T>(
  schema: ZodSchema | null,
  handler: (data: T) => Promise<any>,
) => {
  return async (event: EventBridgeEvent<string, any>) => {
    try {
      console.log('EventBridge event received:', JSON.stringify(event));

      // Para eventos de cron/scheduled, usamos el detail del evento
      const eventData = event.detail || {};

      if (schema) {
        const validationResult = schema.safeParse(eventData);

        if (!validationResult.success) {
          const formattedErrors = validationResult.error.issues
            .map(issue => {
              const path = issue.path.join('.');
              return `${path ? path + ': ' : ''}${issue.message}`;
            })
            .join('; ');

          console.error('Validation error:', formattedErrors);
          throw new Error(`Validation failed: ${formattedErrors}`);
        }

        return await handler(validationResult.data as T);
      }

      return await handler(eventData as T);
    } catch (e: any) {
      BugTracker.captureException(e);
      throw e;
    }
  };
};
