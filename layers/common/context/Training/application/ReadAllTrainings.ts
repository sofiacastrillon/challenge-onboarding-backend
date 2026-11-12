import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { TrainingRepository } from '../domain/TrainingRepository';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { Training } from '../domain/Training';
import { ReadAllTrainingsDTO } from './DTO/ReadAllTrainingsDTO';

@injectable()
export class ReadAllTrainings {
  constructor(
    @inject(TOKENS.TrainingRepository)
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async run(dto: ReadAllTrainingsDTO): Promise<Training[]> {
    return this.trainingRepository.findAll(new IdCompany(dto.idCompany));
  }
}
