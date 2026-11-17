import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { Response } from '/opt/nodejs/shared/infrastructure/api/Response';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';
import { ApiMiddleware } from '/opt/nodejs/shared/infrastructure/api/middleware/ApiMiddleware';
import { RunTrainingAgent } from '/opt/nodejs/context/Training/application/RunTrainingAgent';
import {
  RunTrainingAgentDTO,
  RunTrainingAgentSchema,
} from '/opt/nodejs/context/Training/application/DTO/RunTrainingAgentDTO';

export const runTrainingAgent = ApiMiddleware<RunTrainingAgentDTO>(
  RunTrainingAgentSchema,
  async (data: RunTrainingAgentDTO) => {
    const useCase = DependencyInjection.resolve(RunTrainingAgent);
    const result = await useCase.run(data);

    console.log(
      JSON.stringify({
        message: data.message,
        intent: result.intent,
        reply: result.reply,
      }),
    );

    return Response.format(200, result);
  },
);

export const handler = BugTracker.wrapHandler(runTrainingAgent);
