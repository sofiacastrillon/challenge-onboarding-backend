import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { LogTrainingEvent } from '/opt/nodejs/context/Training/application/LogTrainingEvent';
import { LogTrainingEventSchema } from '/opt/nodejs/context/Training/application/DTO/LogTrainingEventDTO';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';

interface SnsEvent {
  Records: { Sns: { Message: string } }[];
}

export const trainingEventSubscriber = async (
  event: SnsEvent,
): Promise<void> => {
  const logTrainingEvent = DependencyInjection.resolve(LogTrainingEvent);

  event.Records.forEach(record => {
    const message = LogTrainingEventSchema.parse(
      JSON.parse(record.Sns.Message),
    );
    console.log(JSON.stringify(logTrainingEvent.run(message)));
  });
};

export const handler = BugTracker.wrapHandler(trainingEventSubscriber);
