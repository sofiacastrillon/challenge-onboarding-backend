import { inject, injectable } from 'tsyringe';
import { ValidationException } from '../../../shared/domain/exceptions/ValidationException';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { ExampleRepository } from '../domain/ExampleRepository';
import {
  ExampleErrorCodes,
  ExampleErrorMessages,
} from '../domain/ExampleErrorMessages';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { BaseEntityId } from '../../../shared/domain/valueObjects/BaseEntityId';

@injectable()
export class ValidateUniqueExample {
  constructor(
    @inject(TOKENS.ExampleRepository)
    private exampleRepository: ExampleRepository,
  ) {}

  async run(idCompany: string, id: string) {
    const existingExample = await this.exampleRepository.findById(
      new IdCompany(idCompany),
      new BaseEntityId(id),
    );

    if (!existingExample) return;

    throw new ValidationException([
      {
        code: ExampleErrorCodes.EXAMPLE_ALREADY_EXISTS,
        message: ExampleErrorMessages.EXAMPLE_ALREADY_EXISTS,
      },
    ]);
  }
}
