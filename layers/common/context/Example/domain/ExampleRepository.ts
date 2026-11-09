import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { Example } from './Example';
import { BaseEntityId } from '../../../shared/domain/valueObjects/BaseEntityId';

export interface ExampleRepository {
  create(example: Example): Promise<Example>;
  update(example: Example): Promise<Example>;
  delete(example: Example): Promise<void>;
  findById(idCompany: IdCompany, id: BaseEntityId): Promise<Example | null>;
  findAll(idCompany: IdCompany): Promise<Example[]>;
}
