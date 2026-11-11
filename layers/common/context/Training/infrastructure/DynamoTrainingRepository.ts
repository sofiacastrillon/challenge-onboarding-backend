import {
  DynamoRepository,
  IDynamoKey,
} from '../../../shared/infrastructure/persistence/DynamoRepository';
import { TrainingRepository } from '../domain/TrainingRepository';
import { Training } from '../domain/Training';
import { Env } from '../../../shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../../utils/Utils';

const COMPANY_TAG = 'COMPANY#';
const TRAINING_TAG = 'TRAINING#';

export class DynamoTrainingRepository
  extends DynamoRepository
  implements TrainingRepository
{
  constructor() {
    super(getEnv(Env.TRAINING_TABLE_NAME));
  }

  getPk(companyId: string): string {
    return `${COMPANY_TAG}${companyId}`;
  }

  getSk(trainingId: string): string {
    return `${TRAINING_TAG}${trainingId}`;
  }

  getKey(companyId: string, trainingId: string): IDynamoKey {
    return {
      pk: this.getPk(companyId),
      sk: this.getSk(trainingId),
    };
  }

  toDynamoItem(training: Training) {
    const trainingObject = training.toObject();
    return {
      ...trainingObject,
      ...this.getKey(trainingObject.idCompany, trainingObject.id),
    };
  }

  async create(training: Training): Promise<Training> {
    const saved = await this.saveItem(this.toDynamoItem(training), true);
    return Training.fromObject(saved);
  }
}
