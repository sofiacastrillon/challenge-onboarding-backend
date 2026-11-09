import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { EventBridgeMiddleware } from '/opt/nodejs/shared/infrastructure/cron/middleware/EventBridgeMiddleware';
import { PublishStuckOutboxEvents } from '/opt/nodejs/context/Outbox/application/PublishStuckOutboxEvents';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import CronEvent from '/opt/nodejs/shared/infrastructure/cron/CronEvent';
import { EventBus } from '/opt/nodejs/shared/application/EventBus';
import { outboxListeners } from '/opt/nodejs/context/Outbox/application/listeners/OutboxListeners';
import { TOKENS } from '/opt/nodejs/shared/application/di/Tokens';

export const publishStuckEvents = EventBridgeMiddleware(null, async () => {
  const eventBus = DependencyInjection.resolve<EventBus>(TOKENS.EventBus);
  eventBus.subscribe(outboxListeners);

  const publishStuckOutboxEventApplication = DependencyInjection.resolve(
    PublishStuckOutboxEvents,
  );

  const results = await publishStuckOutboxEventApplication.run();

  CronEvent.registerOutput(200, {
    message: `📦 Stuck outbox events processed: 📊 Total: ${results.total} ✅ Processed: ${results.processed} ❌ Failed: ${results.failed}`,
  });
});

export const handler = BugTracker.wrapHandler(publishStuckEvents);
