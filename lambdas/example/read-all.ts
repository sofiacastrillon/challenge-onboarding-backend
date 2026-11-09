import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ReadAllExamples } from '/opt/nodejs/context/Example/application/ReadAllExamples';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import {
  ReadAllExamplesDTO,
  ReadAllExamplesSchema,
} from '/opt/nodejs/context/Example/application/DTO/ReadAllExamplesDTO';

export const readAllExamples = ApiMiddleware<ReadAllExamplesDTO>(
  ReadAllExamplesSchema,
  async (data: ReadAllExamplesDTO) => {
    const readAllExamplesApplication =
      DependencyInjection.resolve(ReadAllExamples);
    const examples = await readAllExamplesApplication.run(data);

    return Response.format(
      200,
      examples.map(example => example.toObject()),
    );
  },
);

export const handler = BugTracker.wrapHandler(readAllExamples);
