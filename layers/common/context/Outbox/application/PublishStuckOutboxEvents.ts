import { OutboxRepository } from '../domain/OutboxRepository';
import { OutboxStatusValue } from '../domain/IOutbox';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { EventBus } from '../../../shared/application/EventBus';
import { OutboxFailedEvent } from '../domain/events/OutboxFailedEvent';

const MARGIN_TO_CONSIDER_AS_STUCK = 1000 * 60 * 5; // 5min
const MAX_RETRIES = 3;

@injectable()
export class PublishStuckOutboxEvents {
  constructor(
    @inject(TOKENS.OutboxRepository)
    private readonly outboxRepository: OutboxRepository,
    @inject(TOKENS.EventBus)
    private readonly eventBus: EventBus,
  ) {}

  async run(): Promise<{
    total: number;
    processed: number;
    failed: number;
  }> {
    const outboxList = await this.outboxRepository.findAllDelayedEvents(
      MARGIN_TO_CONSIDER_AS_STUCK,
    );

    const results = {
      total: outboxList.length,
      processed: 0,
      failed: 0,
    };

    const promises = outboxList.map(async outbox => {
      await this.outboxRepository.updateRetries(outbox);
      outbox.incrementRetries();

      if (outbox.retries > MAX_RETRIES) {
        outbox.setStatus(OutboxStatusValue.FAILED);
        await this.outboxRepository.update(outbox);
        await this.eventBus.publish(new OutboxFailedEvent(outbox.toObject()));
        results.failed += 1;
        return;
      }

      await this.eventBus.publish(outbox.toEntityEvent());
      outbox.setStatus(OutboxStatusValue.PROCESSED);
      await this.outboxRepository.update(outbox);

      results.processed += 1;
    });

    await Promise.all(promises);

    return results;
  }
}
