import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { CreateExample } from '/opt/nodejs/context/Example/application/CreateExample';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import {
  CreateExampleDTO,
  CreateExampleSchema,
} from '/opt/nodejs/context/Example/application/DTO/CreateExampleDTO';
import { exampleListeners } from '/opt/nodejs/context/Example/application/listeners/ExampleListeners';
import { EventBus } from '/opt/nodejs/shared/application/EventBus';
import { TOKENS } from '/opt/nodejs/shared/application/di/Tokens';

export const createExample = ApiMiddleware<CreateExampleDTO>(
  CreateExampleSchema,
  async (data: CreateExampleDTO) => {
    const eventBus = DependencyInjection.resolve<EventBus>(TOKENS.EventBus);
    eventBus.subscribe(exampleListeners);

    const createExampleApplication = DependencyInjection.resolve(CreateExample);
    const example = await createExampleApplication.run(data);

    return Response.format(200, example.toObject());
  },
);

export const handler = BugTracker.wrapHandler(createExample);
