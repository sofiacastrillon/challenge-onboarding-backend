import { inject, injectable } from 'tsyringe';
import { ExampleRepository } from '../domain/ExampleRepository';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { Example } from '../domain/Example';
import { CreateExampleDTO } from './DTO/CreateExampleDTO';
import { EventBus } from '../../../shared/application/EventBus';
import { ValidateUniqueExample } from './ValidateUniqueExample';

@injectable()
export class CreateExample {
  constructor(
    @inject(TOKENS.ExampleRepository)
    private readonly exampleRepository: ExampleRepository,
    @inject(TOKENS.EventBus)
    private readonly eventBus: EventBus,
    @inject(TOKENS.ValidateUniqueExample)
    private readonly validateUniqueExample: ValidateUniqueExample,
  ) {}

  async run(dto: CreateExampleDTO) {
    await this.validateUniqueExample.run(dto.idCompany, dto.id);

    const example = Example.fromObject(dto);
    await this.exampleRepository.create(example);
    await this.eventBus.publish(example.toEntityEvent());
    return example;
  }
}
