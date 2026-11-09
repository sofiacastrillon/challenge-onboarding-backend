import { z } from 'zod';

export const ReadOneExampleSchema = z.object({
  idCompany: z.string(),
  id: z.string().uuid(),
});

export type ReadOneExampleDTO = z.infer<typeof ReadOneExampleSchema>;
