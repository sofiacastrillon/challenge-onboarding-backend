import { ValidationException } from '../../../../shared/domain/exceptions/ValidationException';
import { ErrorCodes } from '../../../../shared/domain/interfaces/IError';

export class TrainingDate {
  constructor(
    readonly value: string,
    readonly field: string,
  ) {
    if (!this.isCalendarDate(value)) {
      throw new ValidationException([
        {
          code: ErrorCodes.INVALID_PARAMS,
          message: `${field} must be a date in YYYY-MM-DD format`,
          field,
        },
      ]);
    }
  }

  private isCalendarDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }
}
