import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { PublishOutboxEventDTO } from '/opt/nodejs/context/Outbox/application/DTO/PublishOutboxEventDTO';
import { PublishOutboxEventSchema } from '/opt/nodejs/context/Outbox/application/DTO/PublishOutboxEventDTO';
import { PublishOutboxEvent } from '/opt/nodejs/context/Outbox/application/PublishOutboxEvent';
import { DynamoStreamMiddleware } from '/opt/nodejs/shared/infrastructure/streams/middleware/DynamoStreamMiddleware';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import StreamEvent from '/opt/nodejs/shared/infrastructure/streams/DynamoStreamEvent';
import { EventBus } from '/opt/nodejs/shared/application/EventBus';
import { outboxListeners } from '/opt/nodejs/context/Outbox/application/listeners/OutboxListeners';
import { TOKENS } from '/opt/nodejs/shared/application/di/Tokens';

export const publishEvent = DynamoStreamMiddleware<PublishOutboxEventDTO>(
  PublishOutboxEventSchema,
  async (data: PublishOutboxEventDTO) => {
    const eventBus = DependencyInjection.resolve<EventBus>(TOKENS.EventBus);
    eventBus.subscribe(outboxListeners);

    const publishOutboxEventApplication =
      DependencyInjection.resolve(PublishOutboxEvent);
    await publishOutboxEventApplication.run(data);

    return StreamEvent.registerOutput(200, {
      message: `Outbox event published successfully for ${data.id}`,
    });
  },
);

export const handler = BugTracker.wrapHandler(publishEvent);
