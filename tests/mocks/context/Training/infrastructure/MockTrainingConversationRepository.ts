import { TrainingConversationRepository } from '../../../../../layers/common/context/Training/domain/TrainingConversationRepository';
import { ITrainingConversation } from '../../../../../layers/common/context/Training/domain/ITrainingConversation';

export class MockTrainingConversationRepository implements TrainingConversationRepository {
  public saved: ITrainingConversation[] = [];

  async save(conversation: ITrainingConversation): Promise<void> {
    this.saved.push(conversation);
  }
}
