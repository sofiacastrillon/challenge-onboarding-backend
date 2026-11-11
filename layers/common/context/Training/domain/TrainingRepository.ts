import { Training } from './Training';

export interface TrainingRepository {
  create(training: Training): Promise<Training>;
}
