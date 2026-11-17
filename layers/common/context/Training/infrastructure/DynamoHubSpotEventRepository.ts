import { DynamoRepository } from '../../../shared/infrastructure/persistence/DynamoRepository';
import { Env } from '../../../shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../../utils/Utils';
import { HubSpotEventRepository } from '../domain/HubSpotEventRepository';
import { IHubSpotEvent } from '../domain/IHubSpotEvent';

const HUBSPOT_TAG = 'HUBSPOT#';
const EVENT_TAG = 'EVENT#';

export class DynamoHubSpotEventRepository
  extends DynamoRepository
  implements HubSpotEventRepository
{
  constructor() {
    super(getEnv(Env.TRAINING_TABLE_NAME));
  }

  async save(event: IHubSpotEvent): Promise<void> {
    await this.saveItem(
      {
        pk: `${HUBSPOT_TAG}${event.objectId}`,
        sk: `${EVENT_TAG}${event.occurredAt}#${event.propertyName}`,
        objectId: event.objectId,
        propertyName: event.propertyName,
        propertyValue: event.propertyValue,
        occurredAt: event.occurredAt,
      },
      true,
    );
  }
}
