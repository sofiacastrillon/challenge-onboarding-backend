import { beforeEach } from '@jest/globals';
import { DependencyInjection } from '../layers/common/shared/infrastructure/di/DependencyInjection';
import { MockNotificationService } from './mocks/shared/infrastructure/MockNotificationService';
import { MockStorageRepository } from './mocks/shared/infrastructure/MockStorageRepository';
import { MockOutboxRepository } from './mocks/context/Outbox/infrastructure/MockOutboxRepository';
import { OutboxRepository } from '../layers/common/context/Outbox/domain/OutboxRepository';
import { ExampleRepository } from '../layers/common/context/Example/domain/ExampleRepository';
import { MockExampleRepository } from './mocks/context/Example/infrastructure/MockExampleRepository';
import { TrainingRepository } from '../layers/common/context/Training/domain/TrainingRepository';
import { MockTrainingRepository } from './mocks/context/Training/infrastructure/MockTrainingRepository';
import { TrainingEventPublisher } from '../layers/common/context/Training/domain/TrainingEventPublisher';
import { MockTrainingEventPublisher } from './mocks/context/Training/infrastructure/MockTrainingEventPublisher';
import { TOKENS } from '../layers/common/shared/application/di/Tokens';
import { NotificationService } from '../layers/common/shared/domain/services/NotificationService';
import { StorageRepository } from '../layers/common/shared/domain/StorageRepository';

import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { MockEventBus } from './mocks/shared/application/MockEventBus';
import { setupUseCasesInjection } from '/opt/nodejs/shared/infrastructure/di/UseCasesInjection';

dotenv.config({ path: '.env' });

beforeEach(() => {
  DependencyInjection.reset();

  DependencyInjection.registerSingleton<ExampleRepository>(
    TOKENS.ExampleRepository,
    MockExampleRepository,
  );

  DependencyInjection.registerSingleton<TrainingRepository>(
    TOKENS.TrainingRepository,
    MockTrainingRepository,
  );

  DependencyInjection.registerSingleton<TrainingEventPublisher>(
    TOKENS.TrainingEventPublisher,
    MockTrainingEventPublisher,
  );

  DependencyInjection.registerSingleton<NotificationService>(
    TOKENS.NotificationService,
    MockNotificationService,
  );

  DependencyInjection.registerSingleton<OutboxRepository>(
    TOKENS.OutboxRepository,
    MockOutboxRepository,
  );

  DependencyInjection.registerSingleton<StorageRepository>(
    TOKENS.StorageRepository,
    MockStorageRepository,
  );

  DependencyInjection.registerSingleton(TOKENS.EventBus, MockEventBus);

  setupUseCasesInjection();
});
