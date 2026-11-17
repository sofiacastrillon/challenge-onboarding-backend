export const TOKENS = {
  OutboxRepository: 'OutboxRepository',
  NotificationService: 'NotificationService',
  StorageRepository: 'StorageRepository',
  ExampleRepository: 'ExampleRepository',
  TrainingRepository: 'TrainingRepository',
  TrainingEventPublisher: 'TrainingEventPublisher',
  HubSpotEventRepository: 'HubSpotEventRepository',
  HubSpotSignatureVerifier: 'HubSpotSignatureVerifier',
  TrainingAgent: 'TrainingAgent',
  TrainingConversationRepository: 'TrainingConversationRepository',
  EventBus: 'EventBus',

  // Use Cases
  ReadOneExample: 'ReadOneExample',
  ValidateUniqueExample: 'ValidateUniqueExample',
} as const;

export type TokenType = (typeof TOKENS)[keyof typeof TOKENS];
