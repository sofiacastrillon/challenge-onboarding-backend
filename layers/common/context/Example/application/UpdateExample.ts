import { inject, injectable } from 'tsyringe';
import { ExampleRepository } from '../domain/ExampleRepository';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { UpdateExampleDTO } from './DTO/UpdateExampleDTO';
import { NotFoundException } from '../../../shared/domain/exceptions/NotFoundException';
import { ReadOneExample } from './ReadOneExample';
import { EventBus } from '../../../shared/application/EventBus';

@injectable()
export class UpdateExample {
  constructor(
    @inject(TOKENS.ExampleRepository)
    private readonly exampleRepository: ExampleRepository,
    @inject(TOKENS.EventBus)
    private readonly eventBus: EventBus,
    @inject(TOKENS.ReadOneExample)
    private readonly readOneExample: ReadOneExample,
  ) {}

  async run(dto: UpdateExampleDTO) {
    const example = await this.readOneExample.run(dto);

    if (!example)
      throw new NotFoundException(`Example with id ${dto.id} not found`);

    example.setName(dto.name);
    example.setDescription(dto.description);
    example.setStatus(dto.status);

    await this.exampleRepository.update(example);
    await this.eventBus.publish(example.toEntityEvent());

    return example;
  }
}
