import { IOutbox, OutboxStatusValue } from './IOutbox';
import { OutboxEntityType } from './valueObjects/OutboxEntityType';
import { OutboxEventType } from './valueObjects/OutboxEventType';
import { OutboxStatus } from './valueObjects/OutboxStatus';
import { OutboxEntityId } from './valueObjects/OutboxEntityId';
import { OutboxRetries } from './valueObjects/OutboxRetries';
import { OutboxTimestamp } from './valueObjects/OutboxTimestamp';
import { EntityTypeValue } from '../../../shared/domain/BaseEntity';
import { CreatedAt } from '../../../shared/domain/valueObjects/CreatedAt';
import { UpdatedAt } from '../../../shared/domain/valueObjects/UpdatedAt';
import { BaseEntity } from '../../../shared/domain/BaseEntity';
import { OutboxEntityEvent } from './events/OutboxEntityEvent';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { BaseEntityId } from '../../../shared/domain/valueObjects/BaseEntityId';
import { ExampleEntityEvent } from '../../Example/domain/events/ExampleEntityEvent';

interface OutboxProps {
  id: BaseEntityId;
  idCompany: IdCompany;
  entityId: OutboxEntityId;
  entityType: OutboxEntityType;
  eventType: OutboxEventType;
  payload: any;
  status: OutboxStatus;
  retries: OutboxRetries;
  timestamp: OutboxTimestamp;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export class Outbox extends BaseEntity {
  constructor(private readonly props: OutboxProps) {
    super(props);
  }

  get entityId() {
    return this.props.entityId.value;
  }

  get entityType() {
    return this.props.entityType.value;
  }

  get eventType() {
    return this.props.eventType.value;
  }

  get payload() {
    return this.props.payload;
  }

  get status() {
    return this.props.status.value;
  }

  get retries() {
    return this.props.retries.value;
  }

  get timestamp() {
    return this.props.timestamp.toString();
  }

  setStatus(status: OutboxStatusValue) {
    this.props.status = new OutboxStatus(status);
  }

  incrementRetries() {
    this.props.retries = new OutboxRetries(this.retries + 1);
  }

  static fromObject(object: IOutbox): Outbox {
    return new Outbox({
      id: new BaseEntityId(object.id),
      idCompany: new IdCompany(object.idCompany),
      entityId: new OutboxEntityId(object.entityId),
      entityType: new OutboxEntityType(object.entityType),
      eventType: new OutboxEventType(object.eventType),
      payload: object.payload,
      status: new OutboxStatus(object.status),
      retries: new OutboxRetries(object.retries),
      timestamp: new OutboxTimestamp(object.timestamp),
      createdAt: new CreatedAt(object.createdAt || null),
      updatedAt: new UpdatedAt(object.updatedAt || null),
    });
  }

  toObject(): IOutbox {
    return {
      id: this.id,
      idCompany: this.idCompany,
      entityId: this.entityId,
      entityType: this.entityType,
      eventType: this.eventType,
      payload: this.payload,
      status: this.status,
      retries: this.retries,
      timestamp: this.timestamp,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getEventToSend() {
    switch (this.entityType) {
      case EntityTypeValue.EXAMPLE:
        return new ExampleEntityEvent(this.payload);

      default:
        throw new Error(
          `Event to send not found for entity type ${this.entityType}`,
        );
    }
  }

  toEntityEvent(): any {
    return new OutboxEntityEvent(this.toObject());
  }

  getEntityType(): EntityTypeValue {
    return EntityTypeValue.OUTBOX;
  }
}
