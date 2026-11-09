import { z } from 'zod';
import { ExampleStatusValue } from '../../domain/IExample';
import { ExampleErrorMessages } from '../../domain/ExampleErrorMessages';

export const CreateExampleSchema = z.object({
  id: z
    .string({ message: ExampleErrorMessages.ID_IS_REQUIRED })
    .uuid({ message: ExampleErrorMessages.INVALID_ID }),
  idCompany: z.string({ message: ExampleErrorMessages.ID_COMPANY_IS_REQUIRED }),
  name: z.string({ message: ExampleErrorMessages.NAME_IS_REQUIRED }).min(5, {
    message: ExampleErrorMessages.NAME_CHARACTERS_LENGTH,
  }),
  description: z
    .string({ message: ExampleErrorMessages.DESCRIPTION_IS_REQUIRED })
    .max(100, { message: ExampleErrorMessages.DESCRIPTION_CHARACTERS_LENGTH }),
  status: z.nativeEnum(ExampleStatusValue, {
    message:
      ExampleErrorMessages.INVALID_STATUS +
      Object.values(ExampleStatusValue).join(', '),
  }),
});

export type CreateExampleDTO = z.infer<typeof CreateExampleSchema>;
