import { EventBus } from '../../../../layers/common/shared/application/EventBus';

export class MockEventBus extends EventBus {
  public publishedEvents: any[] = [];

  async publish(event: any): Promise<void> {
    this.publishedEvents.push(event);
    console.log('Mock EventBus: Event published', event);
  }
}
