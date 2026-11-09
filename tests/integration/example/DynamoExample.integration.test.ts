import { describe, test, expect, beforeAll } from '@jest/globals';
import { DynamoExampleRepository } from '../../../layers/common/context/Example/infrastructure/DynamoExampleRepository';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { IdCompany } from '../../../layers/common/shared/domain/valueObjects/IdCompany';
import { assertPropertiesMatch } from '../../../tests/utils/helpers';
import { BaseEntityId } from '../../../layers/common/shared/domain/valueObjects/BaseEntityId';
import { getEnv } from '../../../layers/common/utils/Utils';
import { Env } from '../../../layers/common/shared/domain/interfaces/IEnvironment';

describe('Dynamo Example Integration', () => {
  let exampleRepository: DynamoExampleRepository;
  const idCompany = new IdCompany(MockExample.idCompany);
  const exampleId = new BaseEntityId(MockExample.id);

  beforeAll(() => {
    process.env.OUTBOX_TABLE_NAME = getEnv(
      Env.OUTBOX_INTEGRATION_TEST_TABLE_NAME,
    );
    exampleRepository = new DynamoExampleRepository();
  });

  test('should create a new example', async () => {
    const example = await exampleRepository.create(MockExample);
    assertPropertiesMatch(MockExample.toObject(), example.toObject());
  });

  test('should update a example', async () => {
    const example = await exampleRepository.update(MockExample);
    assertPropertiesMatch(MockExample.toObject(), example.toObject());
  });

  test('should find a example by id', async () => {
    const example = await exampleRepository.findById(idCompany, exampleId);
    expect(example).not.toBeNull();
  });

  test('should find all examples by organization id', async () => {
    const examples = await exampleRepository.findAll(idCompany);
    expect(examples.length).toBeGreaterThan(0);
  });

  test('should delete a example', async () => {
    await exampleRepository.delete(MockExample);
    const example = await exampleRepository.findById(idCompany, exampleId);
    expect(example).toBeNull();
  });
});
