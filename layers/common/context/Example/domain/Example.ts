import { BaseEntity, EntityTypeValue } from '../../../shared/domain/BaseEntity';
import { BaseEntityId } from '../../../shared/domain/valueObjects/BaseEntityId';
import { CreatedAt } from '../../../shared/domain/valueObjects/CreatedAt';
import { UpdatedAt } from '../../../shared/domain/valueObjects/UpdatedAt';
import { ExampleEntityEvent } from './events/ExampleEntityEvent';
import { ExampleStatusValue, IExample } from './IExample';
import { ExampleDescription } from './valueObjects/ExampleDescription';
import { ExampleName } from './valueObjects/ExampleName';
import { ExampleStatus } from './valueObjects/ExampleStatus';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';

interface ExampleProps {
  id: BaseEntityId;
  idCompany: IdCompany;
  name: ExampleName;
  description: ExampleDescription;
  status: ExampleStatus;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}
export class Example extends BaseEntity {
  constructor(private readonly props: ExampleProps) {
    super(props);
  }

  get name() {
    return this.props.name.value;
  }

  get description() {
    return this.props.description.value;
  }

  get status() {
    return this.props.status.value;
  }

  setName(name: string) {
    this.props.name = new ExampleName(name);
  }

  setDescription(description: string) {
    this.props.description = new ExampleDescription(description);
  }

  setStatus(status: ExampleStatusValue) {
    this.props.status = new ExampleStatus(status);
  }

  static fromObject(object: IExample) {
    return new Example({
      id: new BaseEntityId(object.id),
      idCompany: new IdCompany(object.idCompany),
      name: new ExampleName(object.name),
      description: new ExampleDescription(object.description),
      status: new ExampleStatus(object.status),
      createdAt: new CreatedAt(object.createdAt || null),
      updatedAt: new UpdatedAt(object.updatedAt || null),
    });
  }

  toObject(): IExample {
    return {
      id: this.id,
      idCompany: this.idCompany,
      name: this.name,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getEntityType() {
    return EntityTypeValue.EXAMPLE;
  }

  toEntityEvent() {
    return new ExampleEntityEvent(this.toObject());
  }
}
