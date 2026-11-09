import { describe, test, expect } from '@jest/globals';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { ReadAllExamples } from '../../../layers/common/context/Example/application/ReadAllExamples';

describe('Read All Examples', () => {
  test('Read all Examples', async () => {
    const readAllExamplesApplication =
      DependencyInjection.resolve(ReadAllExamples);
    const examples = await readAllExamplesApplication.run({
      idCompany: MockExample.idCompany,
    });
    expect(examples).toEqual([MockExample]);
  });
});
