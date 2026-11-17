import { IHubSpotEvent } from './IHubSpotEvent';

export interface HubSpotEventRepository {
  save(event: IHubSpotEvent): Promise<void>;
}
