import '/opt/nodejs/bootstrap';
import { DependencyInjection } from '/opt/nodejs/shared/infrastructure/di/DependencyInjection';
import { PublishTrainingEventToKafka } from '/opt/nodejs/context/Training/application/PublishTrainingEventToKafka';
import { LogTrainingEventSchema } from '/opt/nodejs/context/Training/application/DTO/LogTrainingEventDTO';
import BugTracker from '/opt/nodejs/shared/infrastructure/monitoring/BugTracker';

interface SqsEvent {
  Records: { body: string }[];
}

export const sqsToKafka = async (event: SqsEvent): Promise<void> => {
  const publishTrainingEventToKafka = DependencyInjection.resolve(
    PublishTrainingEventToKafka,
  );

  await Promise.all(
    event.Records.map(async record => {
      const message = LogTrainingEventSchema.parse(JSON.parse(record.body));
      await publishTrainingEventToKafka.run(message.payload);
    }),
  );
};

export const handler = BugTracker.wrapHandler(sqsToKafka);
