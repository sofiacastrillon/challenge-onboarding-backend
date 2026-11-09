import { ExampleRepository } from '../../../../../layers/common/context/Example/domain/ExampleRepository';
import { MockExample } from '../domain/MockExample';
import { Example } from '../../../../../layers/common/context/Example/domain/Example';
import { IdCompany } from '../../../../../layers/common/shared/domain/valueObjects/IdCompany';
import { BaseEntityId } from '../../../../../layers/common/shared/domain/valueObjects/BaseEntityId';

export class MockExampleRepository implements ExampleRepository {
  constructor() {}

  async create(example: Example): Promise<Example> {
    example.setCreatedAt(new Date().toISOString());
    example.setUpdatedAt(new Date().toISOString());
    return example;
  }

  async update(example: Example): Promise<Example> {
    return example;
  }

  async delete(example: Example): Promise<void> {
    console.log('delete', example);
    return new Promise(resolve => resolve());
  }

  async findById(
    idCompany: IdCompany,
    id: BaseEntityId,
  ): Promise<Example | null> {
    console.log('findById', idCompany, id);
    if (id.value !== MockExample.id) return null;
    return new Promise(resolve => resolve(MockExample));
  }

  async findAll(): Promise<Example[]> {
    console.log('findAll');
    return new Promise(resolve => resolve([MockExample]));
  }
}
