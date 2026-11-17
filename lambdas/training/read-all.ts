import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { ReadAllTrainings } from '/opt/nodejs/context/Training/application/ReadAllTrainings';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import {
  ReadAllTrainingsDTO,
  ReadAllTrainingsSchema,
} from '/opt/nodejs/context/Training/application/DTO/ReadAllTrainingsDTO';

export const readAllTrainings = ApiMiddleware<ReadAllTrainingsDTO>(
  ReadAllTrainingsSchema,
  async (data: ReadAllTrainingsDTO) => {
    const readAllTrainingsApplication =
      DependencyInjection.resolve(ReadAllTrainings);
    const trainings = await readAllTrainingsApplication.run(data);

    return Response.format(
      200,
      trainings.map(training => training.toObject()),
    );
  },
);

export const handler = BugTracker.wrapHandler(readAllTrainings);
