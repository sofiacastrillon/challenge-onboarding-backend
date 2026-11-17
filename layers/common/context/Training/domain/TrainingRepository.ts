import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { Training } from './Training';

export interface TrainingRepository {
  create(training: Training): Promise<Training>;
  findAll(idCompany: IdCompany): Promise<Training[]>;
}
