import { EventListener } from '../../../../shared/application/EventBus';
import { OutboxEntityEvent } from '../../domain/events/OutboxEntityEvent';
import { OutboxFailedEvent } from '../../domain/events/OutboxFailedEvent';
import { Outbox } from '../../domain/Outbox';

export const outboxListeners: EventListener = (
  subscriber,
  notificationService,
) => {
  subscriber.on<OutboxEntityEvent>(OutboxEntityEvent.name, async event => {
    const outbox = Outbox.fromObject(event.payload);
    await notificationService.publish(outbox.getEventToSend());
  });

  subscriber.on<OutboxFailedEvent>(OutboxFailedEvent.name, async event => {
    console.log(
      `Outbox ${event.payload.id} failed after ${event.payload.retries} retries`,
    );

    // TODO: Implement notification to Google Chat or other communication channel to handle the failure.
  });
};
