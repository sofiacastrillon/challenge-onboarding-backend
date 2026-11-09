import { describe, test } from '@jest/globals';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { DeleteExample } from '../../../layers/common/context/Example/application/DeleteExample';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';

describe('Delete Example', () => {
  test('Delete Example', async () => {
    const deleteExampleApplication = DependencyInjection.resolve(DeleteExample);
    await deleteExampleApplication.run({
      id: MockExample.id,
      idCompany: MockExample.idCompany,
    });
  });
});
