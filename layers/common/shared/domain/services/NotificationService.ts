import { BaseEvent } from '../events/BaseEvent';

export interface NotificationService {
  publish<T>(event: BaseEvent<T>): Promise<void>;
}
