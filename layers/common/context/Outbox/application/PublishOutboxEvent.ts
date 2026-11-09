import { OutboxRepository } from '../domain/OutboxRepository';
import { OutboxStatusValue } from '../domain/IOutbox';
import { PublishOutboxEventDTO } from './DTO/PublishOutboxEventDTO';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { EventBus } from '../../../shared/application/EventBus';
import { Outbox } from '../domain/Outbox';

@injectable()
export class PublishOutboxEvent {
  constructor(
    @inject(TOKENS.OutboxRepository)
    private readonly outboxRepository: OutboxRepository,
    @inject(TOKENS.EventBus)
    private readonly eventBus: EventBus,
  ) {}

  async run(dto: PublishOutboxEventDTO): Promise<void> {
    const outbox = Outbox.fromObject(dto);
    await this.eventBus.publish(outbox.toEntityEvent());

    outbox.setStatus(OutboxStatusValue.PROCESSED);
    await this.outboxRepository.update(outbox);
  }
}
