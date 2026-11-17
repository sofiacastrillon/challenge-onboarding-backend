import {
  TrainingAgent,
  TrainingAgentReply,
} from '../../../../../layers/common/context/Training/domain/TrainingAgent';

export class MockTrainingAgent implements TrainingAgent {
  public messages: string[] = [];

  public reply: TrainingAgentReply = {
    intent: 'soporte',
    reply: 'Te ayudo con eso.',
  };

  async run(message: string): Promise<TrainingAgentReply> {
    this.messages.push(message);
    return this.reply;
  }
}
