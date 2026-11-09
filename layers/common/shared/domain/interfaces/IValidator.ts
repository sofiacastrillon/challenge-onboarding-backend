import { IErrors } from './IError';

export interface IValidationResult {
  success: boolean;
  errors: IErrors[];
}
