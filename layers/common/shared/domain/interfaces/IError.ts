export const ErrorCodes = {
  RESOURCE_NOT_FOUND: '404',
  INVALID_PARAMS: '400',
  FORBIDDEN: '403',
  INVALID_BODY_REQUEST: 'LED1001',
  PARAM_MUST_BE_UUID: 'LED1002',
} as const;
export type ErrorCodes = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const ErrorMessages = {
  RESOURCE_NOT_FOUND: 'Resource not found',
  INVALID_BODY_REQUEST: 'Invalid body request',
  INVALID_PARAMS: 'Invalid params: {{params}}',
  PARAM_MUST_BE_UUID: 'Param id must be a valid UUID',
  FORBIDDEN: 'Forbidden',
} as const;
export type ErrorMessages = (typeof ErrorMessages)[keyof typeof ErrorMessages];

export interface IErrors {
  code: string;
  message: string;
}
