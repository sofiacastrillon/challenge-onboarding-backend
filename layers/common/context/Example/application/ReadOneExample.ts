import { inject, injectable } from 'tsyringe';
import { ExampleRepository } from '../domain/ExampleRepository';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { BaseEntityId } from '../../../shared/domain/valueObjects/BaseEntityId';
import { NotFoundException } from '../../../shared/domain/exceptions/NotFoundException';
import { ReadOneExampleDTO } from './DTO/ReadOneExampleDTO';

@injectable()
export class ReadOneExample {
  constructor(
    @inject(TOKENS.ExampleRepository)
    private readonly exampleRepository: ExampleRepository,
  ) {}

  async run(dto: ReadOneExampleDTO) {
    const exampleFound = await this.exampleRepository.findById(
      new IdCompany(dto.idCompany),
      new BaseEntityId(dto.id),
    );

    if (!exampleFound)
      throw new NotFoundException(`Example with id ${dto.id} not found`);

    return exampleFound;
  }
}
