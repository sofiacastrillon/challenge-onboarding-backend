import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import { UpdateExample } from '/opt/nodejs/context/Example/application/UpdateExample';
import { exampleListeners } from '/opt/nodejs/context/Example/application/listeners/ExampleListeners';
import { EventBus } from '/opt/nodejs/shared/application/EventBus';
import { TOKENS } from '/opt/nodejs/shared/application/di/Tokens';
import {
  UpdateExampleDTO,
  UpdateExampleSchema,
} from '/opt/nodejs/context/Example/application/DTO/UpdateExampleDTO';

export const updateExample = ApiMiddleware<UpdateExampleDTO>(
  UpdateExampleSchema,
  async (data: UpdateExampleDTO) => {
    const eventBus = DependencyInjection.resolve<EventBus>(TOKENS.EventBus);
    eventBus.subscribe(exampleListeners);

    const updateExampleApplication = DependencyInjection.resolve(UpdateExample);
    const newExample = await updateExampleApplication.run(data);

    return Response.format(200, newExample.toObject());
  },
);

export const handler = BugTracker.wrapHandler(updateExample);
