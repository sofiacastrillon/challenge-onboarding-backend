import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { ZodSchema } from 'zod';
import { PrivateRequest } from '../PrivateRequest';
import { Response } from '../Response';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { IAuthorizerContext } from '../PrivateRequest';
import { ValidationMapper } from '../../validation/ValidationMapper';

/**
 * Middleware para API's que utilizan Authorizer que procesa los datos de entrada antes de ejecutar el handler
 * @param schema Schema de Zod para validar la entrada (null si no hay validación)
 * @param handler Función que procesa los datos validados
 */
export const ApiMiddleware = <T = null>(
  schema: ZodSchema | null,
  handler: (
    data: T,
    request: PrivateRequest,
  ) => Promise<ReturnType<typeof Response.format>>,
) => {
  return async (
    event: APIGatewayProxyEventV2WithLambdaAuthorizer<IAuthorizerContext>,
  ) => {
    try {
      const request = new PrivateRequest(event);

      const inputData: { [key: string]: any } = {
        ...request.getBodyParameter(),
        ...request.getPathParameters(),
        ...request.getQueryParameters(),
      };

      const dataToValidate = {
        ...inputData,
        idCompany: request.getTokenInfo().organization.legacyId,
        idUser: request.getTokenInfo().user.legacyId,
        applicationVersion: request.getTokenInfo().applicationVersion,
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
