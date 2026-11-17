import { TrainingIntent } from './TrainingIntent';

export interface TrainingAgentReply {
  intent: TrainingIntent;
  reply: string;
}

export interface TrainingAgent {
  run(message: string): Promise<TrainingAgentReply>;
}
