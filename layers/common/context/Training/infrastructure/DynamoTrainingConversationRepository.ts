import { v7 as uuid } from 'uuid';
import { DynamoRepository } from '../../../shared/infrastructure/persistence/DynamoRepository';
import { Env } from '../../../shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../../utils/Utils';
import { TrainingConversationRepository } from '../domain/TrainingConversationRepository';
import { ITrainingConversation } from '../domain/ITrainingConversation';

const AGENT_TAG = 'AGENT#';
const MESSAGE_TAG = 'MESSAGE#';

export class DynamoTrainingConversationRepository
  extends DynamoRepository
  implements TrainingConversationRepository
{
  constructor() {
    super(getEnv(Env.TRAINING_TABLE_NAME));
  }

  async save(conversation: ITrainingConversation): Promise<void> {
    await this.saveItem(
      {
        pk: `${AGENT_TAG}${conversation.idCompany}`,
        sk: `${MESSAGE_TAG}${new Date().toISOString()}#${uuid()}`,
        idCompany: conversation.idCompany,
        idUser: conversation.idUser,
        message: conversation.message,
        intent: conversation.intent,
        reply: conversation.reply,
      },
      true,
    );
  }
}
