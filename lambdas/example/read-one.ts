import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ReadOneExample } from '/opt/nodejs/context/Example/application/ReadOneExample';
import {
  ReadOneExampleDTO,
  ReadOneExampleSchema,
} from '/opt/nodejs/context/Example/application/DTO/ReadOneExampleDTO';

export const readOneExample = ApiMiddleware<ReadOneExampleDTO>(
  ReadOneExampleSchema,
  async (data: ReadOneExampleDTO) => {
    const readOneExampleApplication =
      DependencyInjection.resolve(ReadOneExample);
    const example = await readOneExampleApplication.run(data);
    return Response.format(200, example?.toObject());
  },
);

export const handler = BugTracker.wrapHandler(readOneExample);
