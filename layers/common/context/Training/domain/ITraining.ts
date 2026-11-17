import { IBaseEntity } from '../../../shared/domain/BaseEntity';

export const DocumentTypeValue = {
  INVOICE: 'invoice',
  CREDIT_NOTE: 'creditNote',
  BILL: 'bill',
  TRANSACTION: 'transaction',
  DEBIT_NOTE: 'debitNote',
} as const;

export type DocumentTypeValue =
  (typeof DocumentTypeValue)[keyof typeof DocumentTypeValue];

export interface ITraining extends IBaseEntity {
  idUser: string;
  documentType: DocumentTypeValue;
  fromDate: string;
  toDate: string;
}
