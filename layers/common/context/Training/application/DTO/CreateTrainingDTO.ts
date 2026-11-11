import { z } from 'zod';
import { DocumentTypeValue } from '../../domain/ITraining';

export const CreateTrainingSchema = z
  .object({
    documentType: z.nativeEnum(DocumentTypeValue, {
      errorMap: () => ({
        message: `documentType must be one of: ${Object.values(DocumentTypeValue).join(', ')}`,
      }),
    }),
    fromDate: z
      .string({ message: 'fromDate is required' })
      .date('fromDate must be a date in YYYY-MM-DD format'),
    toDate: z
      .string({ message: 'toDate is required' })
      .date('toDate must be a date in YYYY-MM-DD format'),
    idCompany: z.string({ message: 'idCompany is required' }).min(1),
    idUser: z.string({ message: 'idUser is required' }).min(1),
  })
  .refine(data => data.fromDate <= data.toDate, {
    message: 'fromDate must be before or equal to toDate',
    path: ['fromDate'],
  });

export type CreateTrainingDTO = z.infer<typeof CreateTrainingSchema>;
