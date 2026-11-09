import { describe, expect, test } from '@jest/globals';
import { assertPropertiesMatch } from '../../../tests/utils/helpers';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { CreateExample } from '../../../layers/common/context/Example/application/CreateExample';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { ValidationException } from '/opt/nodejs/shared/domain/exceptions/ValidationException';
import { v7 } from 'uuid';

describe('Create Example', () => {
  test('Create a valid Example', async () => {
    const createExampleApplication = DependencyInjection.resolve(CreateExample);

    const newExample = {
      ...MockExample.toObject(),
      id: v7(),
    };

    const example = await createExampleApplication.run(newExample);

    const result = example.toObject();

    assertPropertiesMatch(newExample, result);
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  test('Create an existing Example', async () => {
    const createExampleApplication = DependencyInjection.resolve(CreateExample);
    await expect(
      createExampleApplication.run(MockExample.toObject()),
    ).rejects.toThrow(ValidationException);
  });
});
