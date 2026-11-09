import { inject, injectable } from 'tsyringe';
import { ExampleRepository } from '../domain/ExampleRepository';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { ReadAllExamplesDTO } from './DTO/ReadAllExamplesDTO';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';

@injectable()
export class ReadAllExamples {
  constructor(
    @inject(TOKENS.ExampleRepository)
    private readonly exampleRepository: ExampleRepository,
  ) {}

  async run(dto: ReadAllExamplesDTO) {
    const examples = await this.exampleRepository.findAll(
      new IdCompany(dto.idCompany),
    );
    return examples;
  }
}
