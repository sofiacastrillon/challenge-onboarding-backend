import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { SendTrainingEvent } from '/opt/nodejs/context/Training/application/SendTrainingEvent';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import {
  SendTrainingEventDTO,
  SendTrainingEventSchema,
} from '/opt/nodejs/context/Training/application/DTO/SendTrainingEventDTO';

export const sendTrainingEvent = ApiMiddleware<SendTrainingEventDTO>(
  SendTrainingEventSchema,
  async (data: SendTrainingEventDTO) => {
    const sendTrainingEventApplication =
      DependencyInjection.resolve(SendTrainingEvent);
    const payload = await sendTrainingEventApplication.run(data);

    return Response.format(200, payload);
  },
);

export const handler = BugTracker.wrapHandler(sendTrainingEvent);
