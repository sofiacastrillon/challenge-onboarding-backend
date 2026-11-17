import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/application/di/Tokens';
import { TrainingAgent } from '../domain/TrainingAgent';
import { TrainingConversationRepository } from '../domain/TrainingConversationRepository';
import {
  RunTrainingAgentDTO,
  RunTrainingAgentResult,
} from './DTO/RunTrainingAgentDTO';

@injectable()
export class RunTrainingAgent {
  constructor(
    @inject(TOKENS.TrainingAgent)
    private readonly trainingAgent: TrainingAgent,
    @inject(TOKENS.TrainingConversationRepository)
    private readonly conversationRepository: TrainingConversationRepository,
  ) {}

  async run(dto: RunTrainingAgentDTO): Promise<RunTrainingAgentResult> {
    const answer = await this.trainingAgent.run(dto.message);

    await this.conversationRepository.save({
      idCompany: dto.idCompany,
      idUser: dto.idUser,
      message: dto.message,
      intent: answer.intent,
      reply: answer.reply,
    });

    return {
      intent: answer.intent,
      reply: answer.reply,
    };
  }
}
