import { SafeParseReturnType, ZodIssueCode } from 'zod';
import { ValidationError } from '../../domain/exceptions/ValidationException';

const ERROR_CODES: Record<ZodIssueCode, string> = {
  [ZodIssueCode.invalid_type]: 'INVALID_TYPE',
  [ZodIssueCode.invalid_string]: 'INVALID_STRING',
  [ZodIssueCode.too_small]: 'TOO_SMALL',
  [ZodIssueCode.too_big]: 'TOO_BIG',
  [ZodIssueCode.invalid_enum_value]: 'INVALID_ENUM_VALUE',
  [ZodIssueCode.invalid_union]: 'INVALID_UNION',
  [ZodIssueCode.invalid_date]: 'INVALID_DATE',
  [ZodIssueCode.custom]: 'CUSTOM',
  [ZodIssueCode.invalid_literal]: 'INVALID_LITERAL',
  [ZodIssueCode.invalid_union_discriminator]: 'INVALID_UNION_DISCRIMINATOR',
  [ZodIssueCode.unrecognized_keys]: 'UNRECOGNIZED_KEYS',
  [ZodIssueCode.invalid_arguments]: 'INVALID_ARGUMENTS',
  [ZodIssueCode.invalid_return_type]: 'INVALID_RETURN_TYPE',
  [ZodIssueCode.invalid_intersection_types]: 'INVALID_INTERSECTION_TYPES',
  [ZodIssueCode.not_multiple_of]: 'NOT_MULTIPLE_OF',
  [ZodIssueCode.not_finite]: 'NOT_FINITE',
};

export class ValidationMapper {
  static getErrorCodeFromMessage(
    message: string,
    zodIssueCode: ZodIssueCode,
  ): string {
    const customCodeMatch = message.match(/^\[([^\]]+)\]/);
    if (customCodeMatch) {
      return customCodeMatch[1];
    }

    return ERROR_CODES[zodIssueCode] || 'INVALID_TYPE';
  }

  static getErrorsFromValidationResult(
    validationResult: SafeParseReturnType<any, any>,
  ): ValidationError[] {
    if (!validationResult.error) {
      return [];
    }

    return validationResult.error.issues.map(issue => {
      const fieldPath = issue.path.join('.');
      const errorCode = ValidationMapper.getErrorCodeFromMessage(
        issue.message,
        issue.code,
      );

      return {
        code: errorCode,
        message: issue.message,
        field: fieldPath,
      };
    });
  }
}
