import 'reflect-metadata';
import { container } from 'tsyringe';

// 🎯 Domain Interfaces
import { NotificationService } from '../../domain/services/NotificationService';
import { OutboxRepository } from '../../../context/Outbox/domain/OutboxRepository';
import { StorageRepository } from '../../domain/StorageRepository';
import { ExampleRepository } from '../../../context/Example/domain/ExampleRepository';
import { TrainingRepository } from '../../../context/Training/domain/TrainingRepository';

// 🏭 Implements
import { SnsNotificationService } from '../notification/SnsNotificationService';
import { DynamoOutboxRepository } from '../../../context/Outbox/infrastructure/DynamoOutboxRepository';
import { S3Repository } from '../persistence/S3Repository';
import { DynamoExampleRepository } from '../../../context/Example/infrastructure/DynamoExampleRepository';
import { DynamoTrainingRepository } from '../../../context/Training/infrastructure/DynamoTrainingRepository';
import { TOKENS } from '../../application/di/Tokens';
import { EventBus } from '../../application/EventBus';
import { setupUseCasesInjection } from './UseCasesInjection';

container.register<OutboxRepository>(TOKENS.OutboxRepository, {
  useClass: DynamoOutboxRepository,
});

container.register<NotificationService>(TOKENS.NotificationService, {
  useClass: SnsNotificationService,
});

container.register<StorageRepository>(TOKENS.StorageRepository, {
  useClass: S3Repository,
});

container.register<ExampleRepository>(TOKENS.ExampleRepository, {
  useClass: DynamoExampleRepository,
});

container.register<TrainingRepository>(TOKENS.TrainingRepository, {
  useClass: DynamoTrainingRepository,
});

container.registerSingleton<EventBus>(TOKENS.EventBus, EventBus);

setupUseCasesInjection();

export { container as DependencyInjection };
