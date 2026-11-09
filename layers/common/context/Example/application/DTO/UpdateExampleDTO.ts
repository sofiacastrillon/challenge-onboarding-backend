import { z } from 'zod';
import { CreateExampleSchema } from './CreateExampleDTO';

export const UpdateExampleSchema = CreateExampleSchema;

export type UpdateExampleDTO = z.infer<typeof UpdateExampleSchema>;
