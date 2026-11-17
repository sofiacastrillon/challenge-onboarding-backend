import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { CreateTraining } from '/opt/nodejs/context/Training/application/CreateTraining';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import {
  CreateTrainingDTO,
  CreateTrainingSchema,
} from '/opt/nodejs/context/Training/application/DTO/CreateTrainingDTO';

export const createTraining = ApiMiddleware<CreateTrainingDTO>(
  CreateTrainingSchema,
  async (data: CreateTrainingDTO) => {
    const createTrainingApplication =
      DependencyInjection.resolve(CreateTraining);
    const training = await createTrainingApplication.run(data);

    return Response.format(200, training.toObject());
  },
);

export const handler = BugTracker.wrapHandler(createTraining);
