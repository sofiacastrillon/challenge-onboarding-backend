import { describe, test, expect } from '@jest/globals';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { UpdateExample } from '../../../layers/common/context/Example/application/UpdateExample';
import { assertPropertiesMatch } from '../../../tests/utils/helpers';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { ExampleStatusValue } from '../../../layers/common/context/Example/domain/IExample';
import { faker } from '@faker-js/faker';

describe('Update Example', () => {
  test('Update Example', async () => {
    const updateExampleApplication = DependencyInjection.resolve(UpdateExample);
    const expected = {
      ...MockExample.toObject(),
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(
        Object.values(ExampleStatusValue) as [string, ...string[]],
      ) as ExampleStatusValue,
    };
    const newExample = await updateExampleApplication.run(expected);

    const example = newExample.toObject();

    assertPropertiesMatch(expected, example);
    expect(example).toHaveProperty('createdAt', expected.createdAt);
    expect(example).toHaveProperty('updatedAt');
  });
});
