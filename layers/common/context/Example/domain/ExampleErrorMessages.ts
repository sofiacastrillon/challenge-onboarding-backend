export const ExampleErrorCodes = {
  INVALID_ID: 'EXAMPLE001',
  ID_IS_REQUIRED: 'EXAMPLE002',
  ID_COMPANY_IS_REQUIRED: 'EXAMPLE003',
  INVALID_COMPANY_ID: 'EXAMPLE004',
  NAME_IS_REQUIRED: 'EXAMPLE005',
  NAME_CHARACTERS_LENGTH: 'EXAMPLE006',
  DESCRIPTION_IS_REQUIRED: 'EXAMPLE007',
  DESCRIPTION_CHARACTERS_LENGTH: 'EXAMPLE008',
  STATUS_IS_REQUIRED: 'EXAMPLE009',
  INVALID_STATUS: 'EXAMPLE010',
  EXAMPLE_ALREADY_EXISTS: 'EXAMPLE011',
};

export const ExampleErrorMessages = {
  INVALID_ID: `[${ExampleErrorCodes.INVALID_ID}] Example ID is invalid`,
  ID_IS_REQUIRED: `[${ExampleErrorCodes.ID_IS_REQUIRED}] Example ID is required`,
  INVALID_COMPANY_ID: `[${ExampleErrorCodes.INVALID_COMPANY_ID}] Company ID is invalid`,
  ID_COMPANY_IS_REQUIRED: `[${ExampleErrorCodes.ID_COMPANY_IS_REQUIRED}] Company ID is required`,
  NAME_IS_REQUIRED: `[${ExampleErrorCodes.NAME_IS_REQUIRED}] Name is required`,
  NAME_CHARACTERS_LENGTH: `[${ExampleErrorCodes.NAME_CHARACTERS_LENGTH}] Name must be at least 5 characters`,
  DESCRIPTION_IS_REQUIRED: `[${ExampleErrorCodes.DESCRIPTION_IS_REQUIRED}] Description is required`,
  DESCRIPTION_CHARACTERS_LENGTH: `[${ExampleErrorCodes.DESCRIPTION_CHARACTERS_LENGTH}] Description must be less than 100 characters`,
  STATUS_IS_REQUIRED: `[${ExampleErrorCodes.STATUS_IS_REQUIRED}] Status is required`,
  INVALID_STATUS: `[${ExampleErrorCodes.INVALID_STATUS}] Status is invalid. The valid values are: `,
  EXAMPLE_ALREADY_EXISTS: `[${ExampleErrorCodes.EXAMPLE_ALREADY_EXISTS}] Example already exists`,
};
