import {
  DynamoOperation,
  DynamoRepository,
  IDynamoKey,
} from '../../../shared/infrastructure/persistence/DynamoRepository';
import { OutboxRepository } from '../../Outbox/domain/OutboxRepository';
import { OutboxEventTypeValue } from '../../Outbox/domain/IOutbox';
import { DynamoOutboxRepository } from '../../Outbox/infrastructure/DynamoOutboxRepository';
import { ExampleRepository } from '../domain/ExampleRepository';
import { Example } from '../domain/Example';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { BaseEntityId } from '../../../shared/domain/valueObjects/BaseEntityId';
import { IExample } from '../domain/IExample';
import { Env } from '../../../shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../../utils/Utils';

const COMPANY_TAG = 'COMPANY#';
const EXAMPLE_TAG = 'EXAMPLE#';

export class DynamoExampleRepository
  extends DynamoRepository
  implements ExampleRepository
{
  private readonly outboxRepository: OutboxRepository;

  constructor() {
    super(getEnv(Env.EXAMPLES_TABLE_NAME));
    this.outboxRepository = new DynamoOutboxRepository();
  }

  getPk(companyId: string): string {
    return `${COMPANY_TAG}${companyId}`;
  }

  getSk(exampleId: string): string {
    return `${EXAMPLE_TAG}${exampleId}`;
  }

  getKey(companyId: string, exampleId: string): IDynamoKey {
    return {
      pk: this.getPk(companyId),
      sk: this.getSk(exampleId),
    };
  }

  toDynamoItems(example: Example): any {
    const exampleObject = example.toObject();
    return {
      ...exampleObject,
      pk: this.getPk(exampleObject.idCompany),
      sk: this.getSk(exampleObject.id),
    };
  }

  async create(example: Example): Promise<Example> {
    const outboxItem = this.outboxRepository.transformEntityEventToOutboxRecord(
      example,
      OutboxEventTypeValue.NEW,
    );

    const item = this.toDynamoItems(example);

    const transactionItems = [
      {
        tableName: this.tableName,
        item,
        operation: DynamoOperation.PUT,
        isNew: true,
      },
      {
        tableName: this.outboxRepository.getDatabaseName(),
        item: outboxItem,
        operation: DynamoOperation.PUT,
        isNew: true,
      },
    ];

    await this.saveTransactionCrossTable(transactionItems);
    return example;
  }

  async update(example: Example): Promise<Example> {
    const outboxItem = this.outboxRepository.transformEntityEventToOutboxRecord(
      example,
      OutboxEventTypeValue.EDIT,
    );

    const item = this.toDynamoItems(example);

    const transactionItems = [
      {
        tableName: this.tableName,
        item,
        operation: DynamoOperation.PUT,
      },
      {
        tableName: this.outboxRepository.getDatabaseName(),
        item: outboxItem,
        operation: DynamoOperation.PUT,
        isNew: true,
      },
    ];

    await this.saveTransactionCrossTable(transactionItems);
    return example;
  }

  async delete(example: Example): Promise<void> {
    const outboxItem = this.outboxRepository.transformEntityEventToOutboxRecord(
      example,
      OutboxEventTypeValue.DELETE,
    );

    const key = this.getKey(example.idCompany, example.id);
    const transactionItems = [
      {
        tableName: this.tableName,
        item: key,
        operation: DynamoOperation.DELETE,
      },
      {
        tableName: this.outboxRepository.getDatabaseName(),
        item: outboxItem,
        operation: DynamoOperation.PUT,
        isNew: true,
      },
    ];

    await this.saveTransactionCrossTable(transactionItems);
  }

  async findById(
    idCompany: IdCompany,
    id: BaseEntityId,
  ): Promise<Example | null> {
    const result = await this.getItem({
      pk: this.getPk(idCompany.value),
      sk: this.getSk(id.value),
    });

    if (!result.Item) {
      return null;
    }

    return Example.fromObject(result.Item);
  }

  async findAll(idCompany: IdCompany): Promise<Example[]> {
    const result = await this.query({
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': this.getPk(idCompany.value),
      },
    });

    return result.Items.map((item: IExample) => Example.fromObject(item));
  }
}
