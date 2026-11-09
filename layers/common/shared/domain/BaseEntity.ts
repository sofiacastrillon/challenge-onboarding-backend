import { BaseEntityId } from './valueObjects/BaseEntityId';
import { CreatedAt } from './valueObjects/CreatedAt';
import { UpdatedAt } from './valueObjects/UpdatedAt';
import { IdCompany } from './valueObjects/IdCompany';

export const EntityTypeValue = {
  EXAMPLE: 'EXAMPLE',
  OUTBOX: 'OUTBOX',
} as const;

export type EntityTypeValue =
  (typeof EntityTypeValue)[keyof typeof EntityTypeValue];

export interface IBaseEntity {
  id: string;
  idCompany: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BaseEntityProps {
  id: BaseEntityId;
  idCompany: IdCompany;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export abstract class BaseEntity {
  constructor(private readonly baseProps: BaseEntityProps) {}

  get id() {
    return this.baseProps.id.value;
  }

  get idCompany() {
    return this.baseProps.idCompany.value;
  }

  get createdAt() {
    return this.baseProps.createdAt.toString();
  }

  get updatedAt() {
    return this.baseProps.updatedAt.toString();
  }

  setId(id: string) {
    this.baseProps.id = new BaseEntityId(id);
  }

  setIdCompany(idCompany: string) {
    this.baseProps.idCompany = new IdCompany(idCompany);
  }

  setCreatedAt(createdAt: string) {
    this.baseProps.createdAt = new CreatedAt(createdAt);
  }

  setUpdatedAt(updatedAt: string) {
    this.baseProps.updatedAt = new UpdatedAt(updatedAt);
  }

  abstract toEntityEvent(): any;
  abstract getEntityType(): EntityTypeValue;
}
