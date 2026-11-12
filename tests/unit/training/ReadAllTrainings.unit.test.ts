import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { CreateTraining } from '../../../layers/common/context/Training/application/CreateTraining';
import { ReadAllTrainings } from '../../../layers/common/context/Training/application/ReadAllTrainings';
import { ReadAllTrainingsSchema } from '../../../layers/common/context/Training/application/DTO/ReadAllTrainingsDTO';
import { DocumentTypeValue } from '../../../layers/common/context/Training/domain/ITraining';

const companyA = {
  documentType: DocumentTypeValue.INVOICE,
  fromDate: '2026-01-01',
  toDate: '2026-01-31',
  idCompany: '670712',
  idUser: '676592',
};

describe('Read All Trainings', () => {
  test('returns only the records of the requested company', async () => {
    const createTraining = DependencyInjection.resolve(CreateTraining);
    const readAllTrainings = DependencyInjection.resolve(ReadAllTrainings);

    await createTraining.run(companyA);
    await createTraining.run({
      ...companyA,
      idCompany: '111111',
      documentType: DocumentTypeValue.BILL,
    });

    const trainings = await readAllTrainings.run({
      idCompany: companyA.idCompany,
    });

    expect(trainings).toHaveLength(1);
    expect(trainings[0].toObject().idCompany).toBe(companyA.idCompany);
    expect(trainings[0].toObject().documentType).toBe(companyA.documentType);
  });

  test('returns an empty list when the company has no records', async () => {
    const readAllTrainings = DependencyInjection.resolve(ReadAllTrainings);

    const trainings = await readAllTrainings.run({ idCompany: '670712' });

    expect(trainings).toEqual([]);
  });

  test('rejects a missing company id', () => {
    const result = ReadAllTrainingsSchema.safeParse({ idCompany: '' });

    expect(result.success).toBe(false);
  });
});
