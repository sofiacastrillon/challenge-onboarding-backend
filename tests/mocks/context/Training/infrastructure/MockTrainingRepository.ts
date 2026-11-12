import { TrainingRepository } from '../../../../../layers/common/context/Training/domain/TrainingRepository';
import { Training } from '../../../../../layers/common/context/Training/domain/Training';
import { IdCompany } from '../../../../../layers/common/shared/domain/valueObjects/IdCompany';

export class MockTrainingRepository implements TrainingRepository {
  private readonly items: Training[] = [];

  async create(training: Training): Promise<Training> {
    training.setCreatedAt(training.createdAt || new Date().toISOString());
    training.setUpdatedAt(training.updatedAt || new Date().toISOString());
    this.items.push(training);
    return training;
  }

  async findAll(idCompany: IdCompany): Promise<Training[]> {
    return this.items.filter(item => item.idCompany === idCompany.value);
  }
}
