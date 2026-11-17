import { BaseEntity, EntityTypeValue } from '../../../shared/domain/BaseEntity';
import { BaseEntityId } from '../../../shared/domain/valueObjects/BaseEntityId';
import { CreatedAt } from '../../../shared/domain/valueObjects/CreatedAt';
import { UpdatedAt } from '../../../shared/domain/valueObjects/UpdatedAt';
import { IdCompany } from '../../../shared/domain/valueObjects/IdCompany';
import { ValidationException } from '../../../shared/domain/exceptions/ValidationException';
import { ErrorCodes } from '../../../shared/domain/interfaces/IError';
import { DocumentType } from './valueObjects/DocumentType';
import { IdUser } from './valueObjects/IdUser';
import { TrainingDate } from './valueObjects/TrainingDate';
import { TrainingEntityEvent } from './events/TrainingEntityEvent';
import { ITraining } from './ITraining';

interface TrainingProps {
  id: BaseEntityId;
  idCompany: IdCompany;
  idUser: IdUser;
  documentType: DocumentType;
  fromDate: TrainingDate;
  toDate: TrainingDate;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export class Training extends BaseEntity {
  constructor(private readonly props: TrainingProps) {
    super(props);
    this.ensureDateRange();
  }

  get idUser() {
    return this.props.idUser.value;
  }

  get documentType() {
    return this.props.documentType.value;
  }

  get fromDate() {
    return this.props.fromDate.value;
  }

  get toDate() {
    return this.props.toDate.value;
  }

  static create(object: Omit<ITraining, 'createdAt' | 'updatedAt'>): Training {
    const now = new Date().toISOString();
    return Training.fromObject({
      ...object,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromObject(object: ITraining) {
    return new Training({
      id: new BaseEntityId(object.id),
      idCompany: new IdCompany(object.idCompany),
      idUser: new IdUser(object.idUser),
      documentType: new DocumentType(object.documentType),
      fromDate: new TrainingDate(object.fromDate, 'fromDate'),
      toDate: new TrainingDate(object.toDate, 'toDate'),
      createdAt: new CreatedAt(object.createdAt || null),
      updatedAt: new UpdatedAt(object.updatedAt || null),
    });
  }

  toObject(): ITraining {
    return {
      id: this.id,
      idCompany: this.idCompany,
      idUser: this.idUser,
      documentType: this.documentType,
      fromDate: this.fromDate,
      toDate: this.toDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getEntityType() {
    return EntityTypeValue.TRAINING;
  }

  toEntityEvent() {
    return new TrainingEntityEvent(this.toObject());
  }

  private ensureDateRange() {
    if (this.props.fromDate.value > this.props.toDate.value) {
      throw new ValidationException([
        {
          code: ErrorCodes.INVALID_PARAMS,
          message: 'fromDate must be before or equal to toDate',
          field: 'fromDate',
        },
      ]);
    }
  }
}
