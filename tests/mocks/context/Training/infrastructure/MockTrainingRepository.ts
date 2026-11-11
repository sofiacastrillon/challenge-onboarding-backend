import { TrainingRepository } from '../../../../../layers/common/context/Training/domain/TrainingRepository';
import { Training } from '../../../../../layers/common/context/Training/domain/Training';

export class MockTrainingRepository implements TrainingRepository {
  async create(training: Training): Promise<Training> {
    training.setCreatedAt(training.createdAt || new Date().toISOString());
    training.setUpdatedAt(training.updatedAt || new Date().toISOString());
    return training;
  }
}
