import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { CreateTraining } from '../../../layers/common/context/Training/application/CreateTraining';
import { CreateTrainingSchema } from '../../../layers/common/context/Training/application/DTO/CreateTrainingDTO';
import { ValidationException } from '/opt/nodejs/shared/domain/exceptions/ValidationException';
import { DocumentTypeValue } from '../../../layers/common/context/Training/domain/ITraining';

const validInput = {
  documentType: DocumentTypeValue.INVOICE,
  fromDate: '2026-01-01',
  toDate: '2026-01-31',
  idCompany: '90792',
  idUser: '2240661',
};

describe('Create Training', () => {
  test('persists a training record with generated id and timestamps', async () => {
    const createTraining = DependencyInjection.resolve(CreateTraining);

    const training = await createTraining.run(validInput);
    const result = training.toObject();

    expect(result.id).toEqual(expect.any(String));
    expect(result.idCompany).toBe(validInput.idCompany);
    expect(result.idUser).toBe(validInput.idUser);
    expect(result.documentType).toBe(validInput.documentType);
    expect(result.fromDate).toBe(validInput.fromDate);
    expect(result.toDate).toBe(validInput.toDate);
    expect(result.createdAt).toEqual(expect.any(String));
    expect(result.updatedAt).toBe(result.createdAt);
  });

  test('rejects a range where fromDate is after toDate', async () => {
    const createTraining = DependencyInjection.resolve(CreateTraining);

    await expect(
      createTraining.run({
        ...validInput,
        fromDate: '2026-02-01',
        toDate: '2026-01-01',
      }),
    ).rejects.toThrow(ValidationException);
  });

  test('rejects an unknown documentType', () => {
    const result = CreateTrainingSchema.safeParse({
      ...validInput,
      documentType: 'receipt',
    });

    expect(result.success).toBe(false);
  });
});
