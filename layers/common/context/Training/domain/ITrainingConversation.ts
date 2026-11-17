import { TrainingIntent } from './TrainingIntent';

export interface ITrainingConversation {
  idCompany: string;
  idUser: string;
  message: string;
  intent: TrainingIntent;
  reply: string;
}
