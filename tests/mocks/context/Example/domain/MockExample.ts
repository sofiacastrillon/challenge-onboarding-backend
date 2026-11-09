import { Example } from '../../../../../layers/common/context/Example/domain/Example';
import { ExampleStatusValue } from '../../../../../layers/common/context/Example/domain/IExample';
import { AuthorizerContextMock } from '../../../shared/infrastructure/ApiGwMockEvent';

export const MockExample = Example.fromObject({
  id: '550e8400-e29b-41d4-a716-446655440000',
  idCompany: AuthorizerContextMock.organization.legacyId,
  name: 'Example',
  description: 'Example',
  status: ExampleStatusValue.ACTIVE,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
