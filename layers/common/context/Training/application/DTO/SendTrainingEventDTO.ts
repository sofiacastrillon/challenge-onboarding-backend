import { z } from 'zod';

export const SendTrainingEventSchema = z.object({
  eventType: z.string().min(1),
  datetime: z.string().datetime({ offset: true }),
  timestamp: z.number().int(),
});

export type SendTrainingEventDTO = z.infer<typeof SendTrainingEventSchema>;
