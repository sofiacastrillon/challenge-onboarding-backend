import { describe, expect, test } from '@jest/globals';
import { DependencyInjection } from '../../../layers/common/shared/infrastructure/di/DependencyInjection';
import { RunTrainingAgent } from '../../../layers/common/context/Training/application/RunTrainingAgent';
import { TOKENS } from '../../../layers/common/shared/application/di/Tokens';
import { MockTrainingAgent } from '../../mocks/context/Training/infrastructure/MockTrainingAgent';
import { MockTrainingConversationRepository } from '../../mocks/context/Training/infrastructure/MockTrainingConversationRepository';

const dto = {
  message: 'Quiero cancelar mi plan',
  idCompany: '90207',
  idUser: '15',
};

describe('Run Training Agent', () => {
  test('returns the agent reply and stores the conversation', async () => {
    const agent = DependencyInjection.resolve<MockTrainingAgent>(
      TOKENS.TrainingAgent,
    );
    agent.reply = {
      intent: 'cancelacion',
      reply: 'Puedo ayudarte a cancelar el plan.',
    };
    const conversations =
      DependencyInjection.resolve<MockTrainingConversationRepository>(
        TOKENS.TrainingConversationRepository,
      );
    const useCase = DependencyInjection.resolve(RunTrainingAgent);

    const result = await useCase.run(dto);

    expect(result).toEqual(agent.reply);
    expect(agent.messages).toEqual([dto.message]);
    expect(conversations.saved).toEqual([
      {
        idCompany: dto.idCompany,
        idUser: dto.idUser,
        message: dto.message,
        intent: 'cancelacion',
        reply: 'Puedo ayudarte a cancelar el plan.',
      },
    ]);
  });
});
