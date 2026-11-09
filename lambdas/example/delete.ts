import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import { DeleteExample } from '/opt/nodejs/context/Example/application/DeleteExample';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import {
  DeleteExampleDTO,
  DeleteExampleSchema,
} from '/opt/nodejs/context/Example/application/DTO/DeleteExampleDTO';
import { exampleListeners } from '/opt/nodejs/context/Example/application/listeners/ExampleListeners';
import { EventBus } from '/opt/nodejs/shared/application/EventBus';
import { TOKENS } from '/opt/nodejs/shared/application/di/Tokens';

export const deleteExample = ApiMiddleware<DeleteExampleDTO>(
  DeleteExampleSchema,
  async (data: DeleteExampleDTO) => {
    const eventBus = DependencyInjection.resolve<EventBus>(TOKENS.EventBus);
    eventBus.subscribe(exampleListeners);

    const deleteExampleApplication = DependencyInjection.resolve(DeleteExample);
    await deleteExampleApplication.run(data);

    return Response.format(200, {
      message: 'Example deleted successfully',
    });
  },
);

export const handler = BugTracker.wrapHandler(deleteExample);
