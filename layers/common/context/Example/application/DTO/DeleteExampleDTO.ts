import { z } from 'zod';

export const DeleteExampleSchema = z.object({
  idCompany: z.string(),
  id: z.string(),
});

export type DeleteExampleDTO = z.infer<typeof DeleteExampleSchema>;
