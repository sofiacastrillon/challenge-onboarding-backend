import { describe, test, expect } from '@jest/globals';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { ReadOneExample } from '../../../layers/common/context/Example/application/ReadOneExample';

describe('Read One Example', () => {
  test('Read one Example', async () => {
    const readOneExampleApplication =
      DependencyInjection.resolve(ReadOneExample);
    const example = await readOneExampleApplication.run({
      idCompany: MockExample.idCompany,
      id: MockExample.id,
    });
    expect(example).toEqual(MockExample);
  });
});
