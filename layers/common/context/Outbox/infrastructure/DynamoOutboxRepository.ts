import {
  DynamoRepository,
  IDynamoKey,
} from '../../../shared/infrastructure/persistence/DynamoRepository';
import { OutboxRepository } from '../domain/OutboxRepository';
import { Outbox } from '../domain/Outbox';
import {
  IOutbox,
  OutboxEventTypeValue,
  OutboxStatusValue,
} from '../domain/IOutbox';
import { BaseEntity } from '../../../shared/domain/BaseEntity';
import { v7 } from 'uuid';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getEnv } from '../../../utils/Utils';
import { Env } from '../../../shared/domain/interfaces/IEnvironment';

const OUTBOX_TAG = 'OUTBOX#';
const ENTITY_TAG = 'ENTITY#';
const TIMESTAMP_TAG = 'TIMESTAMP#';

const STATUS_GSI = 'status-GSI';

export class DynamoOutboxRepository
  extends DynamoRepository
  implements OutboxRepository
{
  constructor() {
    super(getEnv(Env.OUTBOX_TABLE_NAME));
  }

  getTableName(): string {
    return this.tableName;
  }

  getPk(id: string): string {
    return `${OUTBOX_TAG}${id}`;
  }

  getSk(entityId: string, timestamp: string): string {
    return `${ENTITY_TAG}${entityId}#${TIMESTAMP_TAG}${timestamp}`;
  }

  getKey(id: string, entityId: string, timestamp: string): IDynamoKey {
    return {
      pk: this.getPk(id),
      sk: this.getSk(entityId, timestamp),
    };
  }

  toDynamoItem(outbox: Outbox): any {
    return {
      ...this.getKey(outbox.id, outbox.entityId, outbox.timestamp),
      ...outbox.toObject(),
    };
  }

  async create(outbox: Outbox): Promise<Outbox> {
    const item = this.toDynamoItem(outbox);
    await this.saveItem(item);
    return outbox;
  }

  async update(outbox: Outbox): Promise<Outbox> {
    const item = this.toDynamoItem(outbox);
    await this.saveItem(item);
    return outbox;
  }

  async updateRetries(outbox: Outbox): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.getKey(outbox.id, outbox.entityId, outbox.timestamp),
      UpdateExpression: 'ADD retries :increment',
      ExpressionAttributeValues: {
        ':increment': 1,
      },
    };

    await this.db.send(new UpdateCommand(params));
  }

  async delete(outbox: Outbox): Promise<void> {
    await this.deleteItem(
      this.getKey(outbox.id, outbox.entityId, outbox.timestamp),
    );
  }

  async findById(id: string): Promise<Outbox | null> {
    const result = await this.query({
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': this.getPk(id),
      },
    });

    if (!result.Items) return null;

    return Outbox.fromObject(result.Items[0]);
  }

  async findAllByStatus(status: OutboxStatusValue): Promise<Outbox[]> {
    const result = await this.query({
      TableName: this.tableName,
      IndexName: STATUS_GSI,
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
    });

    if (!result.Items) return [];

    return result.Items.map((item: IOutbox) => Outbox.fromObject(item));
  }

  async findAllDelayedEvents(delay: number): Promise<Outbox[]> {
    const now = new Date();
    const threshold = new Date(now.getTime() - delay).toISOString();

    const result = await this.query({
      TableName: this.tableName,
      IndexName: STATUS_GSI,
      KeyConditionExpression: '#status = :status AND #timestamp < :timestamp',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#timestamp': 'timestamp',
      },
      ExpressionAttributeValues: {
        ':status': OutboxStatusValue.PENDING,
        ':timestamp': threshold,
      },
    });

    if (!result.Items) return [];

    return result.Items.map((item: IOutbox) => Outbox.fromObject(item));
  }

  getDatabaseName(): string {
    return this.tableName;
  }

  transformEntityEventToOutboxRecord(
    entity: BaseEntity,
    eventType: OutboxEventTypeValue,
  ): any {
    const entityEvent = entity.toEntityEvent();

    const outboxEvent = Outbox.fromObject({
      id: v7(),
      idCompany: entity.idCompany,
      entityId: entity.id,
      entityType: entity.getEntityType(),
      eventType: eventType,
      payload: JSON.stringify(entityEvent.toObject()),
      status: OutboxStatusValue.PENDING,
      retries: 0,
      timestamp: new Date().toISOString(),
    });

    return this.toDynamoItem(outboxEvent);
  }
}
