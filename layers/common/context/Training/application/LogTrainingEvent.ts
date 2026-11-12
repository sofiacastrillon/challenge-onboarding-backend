import { injectable } from 'tsyringe';
import {
  LogTrainingEventDTO,
  TrainingEventLogDTO,
} from './DTO/LogTrainingEventDTO';

export const TRAINING_EVENT_LOG_TEXT =
  'This is an event written from a Lambda that listens directly to the SNS event';

@injectable()
export class LogTrainingEvent {
  run(dto: LogTrainingEventDTO): TrainingEventLogDTO {
    return {
      text: TRAINING_EVENT_LOG_TEXT,
      eventType: dto.payload.eventType,
      datetime: dto.payload.datetime,
      timestamp: dto.payload.timestamp,
    };
  }
}
