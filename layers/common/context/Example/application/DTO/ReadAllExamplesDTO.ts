import { z } from 'zod';

export const ReadAllExamplesSchema = z.object({
  idCompany: z.string(),
});

export type ReadAllExamplesDTO = z.infer<typeof ReadAllExamplesSchema>;
