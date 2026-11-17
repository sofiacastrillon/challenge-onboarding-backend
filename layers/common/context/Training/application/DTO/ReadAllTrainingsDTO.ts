import { z } from 'zod';

export const ReadAllTrainingsSchema = z.object({
  idCompany: z.string().min(1),
});

export type ReadAllTrainingsDTO = z.infer<typeof ReadAllTrainingsSchema>;
