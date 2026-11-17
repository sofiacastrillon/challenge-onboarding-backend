import { ITrainingConversation } from './ITrainingConversation';

export interface TrainingConversationRepository {
  save(conversation: ITrainingConversation): Promise<void>;
}
