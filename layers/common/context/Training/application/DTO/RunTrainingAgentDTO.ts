import { z } from 'zod';
import { TRAINING_INTENTS } from '../../domain/TrainingIntent';

export const RunTrainingAgentSchema = z.object({
  message: z
    .string({ message: 'message is required' })
    .trim()
    .min(1, 'message is required'),
  idCompany: z.string({ message: 'idCompany is required' }).min(1),
  idUser: z.string({ message: 'idUser is required' }).min(1),
});

export type RunTrainingAgentDTO = z.infer<typeof RunTrainingAgentSchema>;

export const TrainingAgentReplySchema = z.object({
  intent: z.enum(TRAINING_INTENTS),
  reply: z.string().trim().min(1),
});

export type RunTrainingAgentResult = z.infer<typeof TrainingAgentReplySchema>;
