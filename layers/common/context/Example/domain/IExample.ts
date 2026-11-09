import { IBaseEntity } from '../../../shared/domain/BaseEntity';

export const ExampleStatusValue = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type ExampleStatusValue =
  (typeof ExampleStatusValue)[keyof typeof ExampleStatusValue];

export interface IExample extends IBaseEntity {
  name: string;
  description: string;
  status: ExampleStatusValue;
}
