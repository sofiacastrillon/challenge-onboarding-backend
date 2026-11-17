import { inject, injectable } from 'tsyringe';
import { v7 as uuid } from 'uuid';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { TrainingRepository } from '../domain/TrainingRepository';
import { Training } from '../domain/Training';
import { CreateTrainingDTO } from './DTO/CreateTrainingDTO';

@injectable()
export class CreateTraining {
  constructor(
    @inject(TOKENS.TrainingRepository)
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async run(dto: CreateTrainingDTO): Promise<Training> {
    const training = Training.create({
      ...dto,
      id: uuid(),
    });

    return this.trainingRepository.create(training);
  }
}
