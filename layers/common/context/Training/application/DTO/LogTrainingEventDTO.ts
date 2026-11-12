import { z } from 'zod';
import { SendTrainingEventSchema } from './SendTrainingEventDTO';

export const LogTrainingEventSchema = z.object({
  type: z.literal('TrainingEventSent'),
  payload: SendTrainingEventSchema,
});

export type LogTrainingEventDTO = z.infer<typeof LogTrainingEventSchema>;

export interface TrainingEventLogDTO {
  text: string;
  eventType: string;
  datetime: string;
  timestamp: number;
}
