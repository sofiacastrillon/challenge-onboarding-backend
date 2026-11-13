import { HubSpotEventRepository } from '../../../../../layers/common/context/Training/domain/HubSpotEventRepository';
import { IHubSpotEvent } from '../../../../../layers/common/context/Training/domain/IHubSpotEvent';

export class MockHubSpotEventRepository implements HubSpotEventRepository {
  public saved: IHubSpotEvent[] = [];

  async save(event: IHubSpotEvent): Promise<void> {
    this.saved.push(event);
  }
}
