import { EntityTypeValue } from '../../../../shared/domain/BaseEntity';

export class OutboxEntityType {
  constructor(readonly value: EntityTypeValue) {
    if (!Object.values(EntityTypeValue).includes(value)) {
      throw new Error('Invalid OutboxEntityType');
    }
  }
}
