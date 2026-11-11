import { createExample } from '../../../lambdas/example/create';
import { deleteExample } from '../../../lambdas/example/delete';
import { readAllExamples } from '../../../lambdas/example/read-all';
import { readOneExample } from '../../../lambdas/example/read-one';
import { updateExample } from '../../../lambdas/example/update';
import { MockExample } from '../../mocks/context/Example/domain/MockExample';
import { ApiGwMockEvent } from '../../mocks/shared/infrastructure/ApiGwMockEvent';
import { assertPropertiesMatch } from '../../utils/helpers';
import { describe, it, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { v7 } from 'uuid';

describe('Example acceptance tests', () => {
  const expectedExample = MockExample.toObject();

  it('Given a Example Data, when we create a example, then we receive a successful response', async () => {
    const newExample = {
      ...expectedExample,
      id: v7(),
    };

    const result = await createExample(
      ApiGwMockEvent({
        bodyParams: newExample,
      }),
    );

    const data = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode', 200);
    assertPropertiesMatch(newExample, data);
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
  });

  it('Given a Example Data, when we read a example, then we receive a successful response', async () => {
    const { body } = await readOneExample(
      ApiGwMockEvent({
        pathParams: {
          id: expectedExample.id,
        },
      }),
    );

    const data = JSON.parse(body);

    assertPropertiesMatch(expectedExample, data);
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
  });

  it('Given a Example Data, when we read all examples by organization, then we receive a successful response', async () => {
    const { body } = await readAllExamples(ApiGwMockEvent({}));

    const data = JSON.parse(body);

    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('createdAt');
    expect(data[0]).toHaveProperty('updatedAt');
  });

  it('Given a Example Data, when we update a example, then we receive a successful response', async () => {
    const updatedExample = {
      ...expectedExample,
      // Keep within CreateExampleSchema: name min 5 chars, description max 100.
      name: faker.lorem.word({ length: { min: 5, max: 15 } }),
      description: faker.lorem.sentence({ min: 2, max: 4 }),
    };

    const result = await updateExample(
      ApiGwMockEvent({
        bodyParams: updatedExample,
      }),
    );

    expect(result).toHaveProperty('statusCode', 200);
    expect(result).toHaveProperty('body', JSON.stringify(updatedExample));
  });

  it('Given a Example Data, when we delete a example, then we receive a successful response', async () => {
    const response = await deleteExample(
      ApiGwMockEvent({
        pathParams: {
          id: expectedExample.id,
        },
      }),
    );

    expect(response).toHaveProperty('statusCode', 200);
  });
});
