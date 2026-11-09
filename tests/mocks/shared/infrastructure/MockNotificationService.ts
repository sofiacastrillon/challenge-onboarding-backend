import { NotificationService } from '../../../../layers/common/shared/domain/services/NotificationService';
import { BaseEvent } from '../../../../layers/common/shared/domain/events/BaseEvent';

export class MockNotificationService implements NotificationService {
  public events: BaseEvent<any>[] = [];

  async publish<T>(event: BaseEvent<T>): Promise<void> {
    this.events.push(event);
  }

  clear() {
    this.events = [];
  }
}
