export const TOKENS = {
  OutboxRepository: 'OutboxRepository',
  NotificationService: 'NotificationService',
  StorageRepository: 'StorageRepository',
  ExampleRepository: 'ExampleRepository',
  EventBus: 'EventBus',

  // Use Cases
  ReadOneExample: 'ReadOneExample',
  ValidateUniqueExample: 'ValidateUniqueExample',
} as const;

export type TokenType = (typeof TOKENS)[keyof typeof TOKENS];
