import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ZodSchema } from 'zod';
import { Response } from '../Response';
import { PublicRequest } from '../PublicRequest';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { ValidationMapper } from '../../validation/ValidationMapper';

/**
 * Middleware para API's públicas que procesa los datos de entrada antes de ejecutar el handler
 * @param schema Schema de Zod para validar la entrada (null si no hay validación)
 * @param handler Función que procesa los datos validados
 */
export const PublicApiMiddleware = <T = null>(
  schema: ZodSchema | null,
  handler: (
    data: T,
    request: PublicRequest,
  ) => Promise<ReturnType<typeof Response.format>>,
) => {
  return async (event: APIGatewayProxyEventV2) => {
    try {
      const request = new PublicRequest(event);

      const bodyParams = request.getBodyParameter();
      const pathParams = request.getPathParameters();
      const queryParams = request.getQueryParameters();

      const dataToValidate = {
        ...bodyParams,
        ...pathParams,
        ...queryParams,
      };

      if (!schema) {
        return await handler(dataToValidate as T, request);
      }

      const validationResult = schema.safeParse(dataToValidate);

      if (!validationResult.success) {
        const errors =
          ValidationMapper.getErrorsFromValidationResult(validationResult);
        throw new ValidationException(errors);
      }

      return await handler(validationResult.data as T, request);
    } catch (error) {
      return Response.handleException(error);
    }
  };
};
