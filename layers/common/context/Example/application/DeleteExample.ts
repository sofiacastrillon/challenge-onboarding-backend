import { inject, injectable } from 'tsyringe';
import { ExampleRepository } from '../domain/ExampleRepository';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { NotFoundException } from '../../../shared/domain/exceptions/NotFoundException';
import { DeleteExampleDTO } from './DTO/DeleteExampleDTO';
import { ReadOneExample } from './ReadOneExample';
import { EventBus } from '../../../shared/application/EventBus';

@injectable()
export class DeleteExample {
  constructor(
    @inject(TOKENS.ExampleRepository)
    private readonly exampleRepository: ExampleRepository,
    @inject(TOKENS.EventBus)
    private readonly eventBus: EventBus,
    @inject(TOKENS.ReadOneExample)
    private readonly readOneExample: ReadOneExample,
  ) {}

  async run(dto: DeleteExampleDTO) {
    const example = await this.readOneExample.run(dto);

    if (!example)
      throw new NotFoundException(`Example with id ${dto.id} not found`);

    await this.exampleRepository.delete(example);
    await this.eventBus.publish(example.toEntityEvent());
    return example;
  }
}
